using System.Globalization;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Services;

public sealed class StatsService(CampusFlowDbContext db)
{
    public async Task<StatsResponse> GetAsync(StatsQuery filter, CancellationToken cancellationToken)
    {
        var fromDate = DateOnly.ParseExact(filter.DateFrom!, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        var toDate = DateOnly.ParseExact(filter.DateTo!, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        var days = toDate.DayNumber - fromDate.DayNumber + 1;
        string[] buildings = filter.Building is null ? ["A", "B", "C", "D"] : [filter.Building];
        var rooms = db.Rooms.AsNoTracking().Where(room => filter.Building == null || room.Building == filter.Building);
        var roomCounts = await rooms.GroupBy(room => room.Building)
            .Select(group => new { Building = group.Key, Rooms = group.Count() })
            .ToDictionaryAsync(item => item.Building, item => item.Rooms, cancellationToken);
        var active = from booking in db.Bookings.AsNoTracking()
                     join room in rooms on booking.RoomId equals room.Id
                     where booking.Status == "active" && booking.Date >= fromDate && booking.Date <= toDate
                     select new { booking.Date, booking.StartTime, booking.EndTime, RoomId = room.Id, room.Name, room.Building };
        var loads = await active.GroupBy(item => new { item.RoomId, item.Name, item.Building, item.Date })
            .Select(group => new
            {
                group.Key.RoomId, group.Key.Name, group.Key.Building, group.Key.Date,
                Bookings = group.LongCount(),
                Minutes = group.Sum(item => (long)((item.EndTime.Hour - item.StartTime.Hour) * 60 + item.EndTime.Minute - item.StartTime.Minute))
            }).ToListAsync(cancellationToken);
        var intervals = await active.GroupBy(item => new { item.StartTime, item.EndTime })
            .Select(group => new { group.Key.StartTime, group.Key.EndTime, Bookings = group.LongCount() })
            .ToListAsync(cancellationToken);
        var byCell = loads.ToLookup(item => (item.Building, item.Date));
        var cells = new List<LoadCell>();
        foreach (var building in buildings)
        {
            var capacity = roomCounts.GetValueOrDefault(building) * 540L;
            for (var day = fromDate.DayNumber; day <= toDate.DayNumber; day++)
            {
                var date = DateOnly.FromDayNumber(day);
                var own = byCell[(building, date)];
                var minutes = own.Sum(item => item.Minutes);
                cells.Add(new LoadCell(building, date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    own.Sum(item => item.Bookings), minutes, capacity, Percent(minutes, capacity)));
            }
        }
        var byBuilding = cells.GroupBy(cell => cell.Building).Select(group =>
            new BuildingStats(group.Key, roomCounts.GetValueOrDefault(group.Key), group.Sum(cell => cell.Minutes),
                Percent(group.Sum(cell => cell.Minutes), group.Sum(cell => cell.CapacityMinutes)))).ToArray();
        var byDay = cells.GroupBy(cell => cell.Date).OrderBy(group => group.Key, StringComparer.Ordinal).Select(group =>
            new DayStats(group.Key, group.Sum(cell => cell.Bookings), group.Sum(cell => cell.Minutes),
                Percent(group.Sum(cell => cell.Minutes), group.Sum(cell => cell.CapacityMinutes)))).ToArray();
        var byHalfHour = Enumerable.Range(0, 18).Select(index =>
        {
            var start = new TimeOnly(9, 0).AddMinutes(index * 30);
            return intervals.Where(item => item.StartTime <= start && start < item.EndTime).Sum(item => item.Bookings);
        }).ToArray();
        var topRooms = loads.GroupBy(item => new { item.RoomId, item.Name })
            .Select(group => new RoomStats(group.Key.RoomId, group.Key.Name, group.Sum(item => item.Minutes), group.Sum(item => item.Bookings)))
            .OrderByDescending(item => item.Minutes).ThenBy(item => item.Name, StringComparer.Ordinal).ThenBy(item => item.RoomId)
            .Take(10).ToArray();
        var totalMinutes = loads.Sum(item => item.Minutes);
        var capacityMinutes = roomCounts.Values.Sum(count => (long)count) * 540L * days;
        return new StatsResponse(new StatsTotals(loads.Sum(item => item.Bookings), totalMinutes, Percent(totalMinutes, capacityMinutes)),
            byBuilding, byDay, cells.ToArray(), byHalfHour, topRooms);
    }

    private static decimal Percent(long minutes, long capacity) => capacity == 0 ? 0 : minutes * 100m / capacity;
}
