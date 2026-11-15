using System.Globalization;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using CampusFlow.Api.Validation;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace CampusFlow.Api.Services;

public sealed record BookingCreationResult(BookingResponse? Booking, string? ErrorCode = null);

public sealed class BookingService(CampusFlowDbContext db, TimeProvider clock)
{
    public async Task<string?> CancelAsync(int userId, int bookingId, CancellationToken cancellationToken, bool asAdmin = false)
    {
        if (!await db.Users.AnyAsync(user => user.Id == userId, cancellationToken))
            return "UNAUTHORIZED";
        var updated = await db.Bookings
            .Where(booking => booking.Id == bookingId && (asAdmin || booking.UserId == userId) && booking.Status == "active")
            .ExecuteUpdateAsync(update => update.SetProperty(booking => booking.Status, "cancelled"), cancellationToken);
        if (updated == 1)
            return null;
        var booking = await db.Bookings.AsNoTracking().Where(booking => booking.Id == bookingId)
            .Select(booking => new { booking.UserId }).SingleOrDefaultAsync(cancellationToken);
        if (booking is null)
            return "BOOKING_NOT_FOUND";
        if (!asAdmin && booking.UserId != userId)
            return "FORBIDDEN";
        return "ALREADY_CANCELLED";
    }

    public async Task<BookingCreationResult> CreateAsync(int userId, CreateBookingRequest request, CancellationToken cancellationToken)
    {
        var user = await db.Users.AsNoTracking().Where(user => user.Id == userId)
            .Select(user => new { user.DisplayName }).SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            return new(null, "UNAUTHORIZED");
        var room = await db.Rooms.AsNoTracking().Where(room => room.Id == request.RoomId)
            .Select(room => new { room.Name }).SingleOrDefaultAsync(cancellationToken);
        if (room is null)
            return new(null, "ROOM_NOT_FOUND");
        if (BookingTimeValidation.HasStarted(request.Date!, request.StartTime!, clock))
            return new(null, "VALIDATION_ERROR");

        var booking = new Booking
        {
            RoomId = request.RoomId!.Value, UserId = userId,
            Date = DateOnly.ParseExact(request.Date!, "yyyy-MM-dd", CultureInfo.InvariantCulture),
            StartTime = TimeOnly.ParseExact(request.StartTime!, "HH:mm", CultureInfo.InvariantCulture),
            EndTime = TimeOnly.ParseExact(request.EndTime!, "HH:mm", CultureInfo.InvariantCulture),
            Status = "active", Comment = request.Comment
        };
        try
        {
            var ids = await db.Database.SqlQuery<int>($"""
                INSERT INTO "Bookings" ("RoomId", "UserId", "Date", "StartTime", "EndTime", "Status", "Comment")
                VALUES ({booking.RoomId}, {booking.UserId}, {booking.Date}, {booking.StartTime}, {booking.EndTime}, {booking.Status}, {booking.Comment})
                ON CONFLICT ON CONSTRAINT "Bookings_NoOverlap" DO NOTHING
                RETURNING "Id" AS "Value"
                """).ToListAsync(cancellationToken);
            if (ids.Count == 0)
                return new(null, "BOOKING_CONFLICT");
            booking.Id = ids.Single();
        }
        catch (PostgresException exception) when (exception is
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: "FK_Bookings_Rooms_RoomId" })
        {
            return new(null, "ROOM_NOT_FOUND");
        }
        catch (PostgresException exception) when (exception is
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: "FK_Bookings_Users_UserId" })
        {
            return new(null, "UNAUTHORIZED");
        }
        return new(new BookingResponse(booking.Id, booking.RoomId, room.Name, userId, user.DisplayName,
            request.Date!, request.StartTime!, request.EndTime!, booking.Status, booking.Comment));
    }

    public async Task<BookingResponse[]?> GetMineAsync(int userId, string? status, CancellationToken cancellationToken)
    {
        if (!await db.Users.AnyAsync(user => user.Id == userId, cancellationToken))
            return null;
        return await ReadAsync(new AdminBookingsQuery { UserId = userId, Status = status }, cancellationToken);
    }

    public async Task<BookingResponse[]?> GetAllAsync(int adminId, AdminBookingsQuery filters, CancellationToken cancellationToken)
    {
        if (!await db.Users.AnyAsync(user => user.Id == adminId, cancellationToken))
            return null;
        return await ReadAsync(filters, cancellationToken);
    }

    private async Task<BookingResponse[]> ReadAsync(AdminBookingsQuery filters, CancellationToken cancellationToken)
    {
        var query = db.Bookings.AsNoTracking();
        if (filters.UserId is not null)
            query = query.Where(booking => booking.UserId == filters.UserId);
        if (filters.RoomId is not null)
            query = query.Where(booking => booking.RoomId == filters.RoomId);
        if (filters.Date is not null)
        {
            var date = DateOnly.ParseExact(filters.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            query = query.Where(booking => booking.Date == date);
        }
        if (filters.DateFrom is not null)
        {
            var from = DateOnly.ParseExact(filters.DateFrom, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            query = query.Where(booking => booking.Date >= from);
        }
        if (filters.DateTo is not null)
        {
            var to = DateOnly.ParseExact(filters.DateTo, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            query = query.Where(booking => booking.Date <= to);
        }
        var status = filters.Status;
        if (status is not null)
            query = query.Where(booking => booking.Status == status);
        var search = string.IsNullOrWhiteSpace(filters.Q) ? null
            : filters.Q.Trim().Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");
        var bookings = await (from booking in query
                              join room in db.Rooms on booking.RoomId equals room.Id
                              join user in db.Users on booking.UserId equals user.Id
                              where filters.Building == null || room.Building == filters.Building
                              where search == null || EF.Functions.ILike(room.Name, search, "\\") || EF.Functions.ILike(user.DisplayName, search, "\\")
                              orderby booking.Date, booking.StartTime, booking.Id
                              select new
                              {
                                  booking.Id, booking.RoomId, RoomName = room.Name, booking.UserId,
                                  UserDisplayName = user.DisplayName, booking.Date, booking.StartTime,
                                  booking.EndTime, booking.Status, booking.Comment
                              }).ToListAsync(cancellationToken);
        return bookings.Select(booking => new BookingResponse(booking.Id, booking.RoomId, booking.RoomName,
            booking.UserId, booking.UserDisplayName, booking.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            booking.StartTime.ToString("HH:mm", CultureInfo.InvariantCulture), booking.EndTime.ToString("HH:mm", CultureInfo.InvariantCulture),
            booking.Status, booking.Comment)).ToArray();
    }
}
