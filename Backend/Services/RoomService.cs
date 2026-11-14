using System.Globalization;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Services;

public sealed class RoomService(CampusFlowDbContext db)
{
    public async Task<RoomResponse[]> GetRoomsAsync(RoomSearchQuery filter, CancellationToken cancellationToken)
    {
        var query = db.Rooms.AsNoTracking();
        if (filter.Building is not null)
            query = query.Where(room => room.Building == filter.Building);
        if (filter.MinCapacity is not null)
        {
            var capacity = int.Parse(filter.MinCapacity, CultureInfo.InvariantCulture);
            query = query.Where(room => room.Capacity >= capacity);
        }
        var equipment = filter.GetEquipment();
        if (equipment.Length > 0)
            query = query.Where(room => equipment.All(item => room.Equipment.Contains(item)));
        return await query.OrderBy(room => room.Id)
            .Select(room => new RoomResponse(room.Id, room.Name, room.Building, room.Floor, room.Capacity, room.Equipment))
            .ToArrayAsync(cancellationToken);
    }

    public Task<RoomResponse?> GetRoomAsync(int id, CancellationToken cancellationToken) => db.Rooms.AsNoTracking()
        .Where(room => room.Id == id)
        .Select(room => new RoomResponse(room.Id, room.Name, room.Building, room.Floor, room.Capacity, room.Equipment))
        .SingleOrDefaultAsync(cancellationToken);

    public async Task<AvailableRoomsResponse> GetAvailabilityAsync(RoomResponse[] rooms, string dateText,
        string? startTime, string? endTime, CancellationToken cancellationToken)
    {
        var date = DateOnly.ParseExact(dateText, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        var roomIds = rooms.Select(room => room.Id).ToArray();
        var bookings = await db.Bookings.AsNoTracking()
            .Where(booking => roomIds.Contains(booking.RoomId) && booking.Date == date && booking.Status == "active")
            .OrderBy(booking => booking.StartTime)
            .Select(booking => new { booking.RoomId, booking.StartTime, booking.EndTime })
            .ToListAsync(cancellationToken);
        var byRoom = bookings.ToLookup(booking => booking.RoomId);
        var requestedStart = startTime is null ? (TimeOnly?)null : TimeOnly.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture);
        var requestedEnd = endTime is null ? (TimeOnly?)null : TimeOnly.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture);
        var result = new List<AvailableRoomResponse>();
        foreach (var room in rooms)
        {
            var intervals = byRoom[room.Id].Select(booking => (Start: booking.StartTime, End: booking.EndTime));
            var free = CalculateFreeSlots(intervals);
            if (requestedStart.HasValue && !free.Any(slot => slot.Start <= requestedStart.Value && slot.End >= requestedEnd!.Value))
                continue;
            var slots = free.Select(slot => new FreeSlotResponse(slot.Start.ToString("HH:mm", CultureInfo.InvariantCulture),
                slot.End.ToString("HH:mm", CultureInfo.InvariantCulture))).ToArray();
            result.Add(new AvailableRoomResponse(room.Id, room.Name, room.Building, room.Floor, room.Capacity, room.Equipment, slots));
        }
        return new AvailableRoomsResponse(dateText, result.ToArray());
    }

    private static List<(TimeOnly Start, TimeOnly End)> CalculateFreeSlots(IEnumerable<(TimeOnly Start, TimeOnly End)> bookings)
    {
        var result = new List<(TimeOnly Start, TimeOnly End)>();
        var cursor = new TimeOnly(9, 0);
        var close = new TimeOnly(18, 0);
        foreach (var booking in bookings)
        {
            if (booking.Start > cursor)
                result.Add((cursor, booking.Start));
            if (booking.End > cursor)
                cursor = booking.End;
        }
        if (cursor < close)
            result.Add((cursor, close));
        return result;
    }
}
