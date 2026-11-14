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
    public async Task<string?> CancelAsync(int userId, int bookingId, CancellationToken cancellationToken)
    {
        if (!await db.Users.AnyAsync(user => user.Id == userId, cancellationToken))
            return "UNAUTHORIZED";
        var updated = await db.Bookings
            .Where(booking => booking.Id == bookingId && booking.UserId == userId && booking.Status == "active")
            .ExecuteUpdateAsync(update => update.SetProperty(booking => booking.Status, "cancelled"), cancellationToken);
        if (updated == 1)
            return null;
        var booking = await db.Bookings.AsNoTracking().Where(booking => booking.Id == bookingId)
            .Select(booking => new { booking.UserId }).SingleOrDefaultAsync(cancellationToken);
        if (booking is null)
            return "BOOKING_NOT_FOUND";
        if (booking.UserId != userId)
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
        db.Bookings.Add(booking);
        try
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ExclusionViolation, ConstraintName: "Bookings_NoOverlap" })
        {
            db.Entry(booking).State = EntityState.Detached;
            return new(null, "BOOKING_CONFLICT");
        }
        catch (DbUpdateException exception) when (exception.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: "FK_Bookings_Rooms_RoomId" })
        {
            db.Entry(booking).State = EntityState.Detached;
            return new(null, "ROOM_NOT_FOUND");
        }
        catch (DbUpdateException exception) when (exception.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: "FK_Bookings_Users_UserId" })
        {
            db.Entry(booking).State = EntityState.Detached;
            return new(null, "UNAUTHORIZED");
        }
        return new(new BookingResponse(booking.Id, booking.RoomId, room.Name, userId, user.DisplayName,
            request.Date!, request.StartTime!, request.EndTime!, booking.Status, booking.Comment));
    }

    public async Task<BookingResponse[]?> GetMineAsync(int userId, string? status, CancellationToken cancellationToken)
    {
        if (!await db.Users.AnyAsync(user => user.Id == userId, cancellationToken))
            return null;
        var query = db.Bookings.AsNoTracking().Where(booking => booking.UserId == userId);
        if (status is not null)
            query = query.Where(booking => booking.Status == status);
        var bookings = await (from booking in query
                              join room in db.Rooms on booking.RoomId equals room.Id
                              join user in db.Users on booking.UserId equals user.Id
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
