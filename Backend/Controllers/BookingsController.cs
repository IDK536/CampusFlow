using System.Globalization;
using System.Security.Claims;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Roles = "student")]
[Route("api/bookings")]
[ProducesResponseType<ApiError>(400)]
[ProducesResponseType<ApiError>(401)]
[ProducesResponseType<ApiError>(403)]
public sealed class BookingsController(BookingService bookings) : ControllerBase
{
    [HttpDelete("{id}")]
    [ProducesResponseType<BookingCancellationResponse>(200)]
    [ProducesResponseType<ApiError>(404)]
    [ProducesResponseType<ApiError>(409)]
    public async Task<IActionResult> Cancel(int id, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
            return Unauthorized(new ApiError("UNAUTHORIZED", "Требуется авторизация"));
        var error = await bookings.CancelAsync(userId, id, cancellationToken);
        return error switch
        {
            null => Ok(new BookingCancellationResponse(id, "cancelled")),
            "UNAUTHORIZED" => Unauthorized(new ApiError("UNAUTHORIZED", "Требуется повторный вход")),
            "BOOKING_NOT_FOUND" => NotFound(new ApiError("BOOKING_NOT_FOUND", "Бронь не найдена", new { bookingId = id })),
            "FORBIDDEN" => StatusCode(403, new ApiError("FORBIDDEN", "Нельзя отменить чужую бронь", new { bookingId = id })),
            "ALREADY_CANCELLED" => Conflict(new ApiError("ALREADY_CANCELLED", "Бронь уже отменена", new { bookingId = id })),
            _ => throw new InvalidOperationException("Unknown cancellation result.")
        };
    }

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<BookingResponse>(201)]
    [ProducesResponseType<ApiError>(404)]
    [ProducesResponseType<ApiError>(409)]
    public async Task<IActionResult> Create(CreateBookingRequest request, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
            return Unauthorized(new ApiError("UNAUTHORIZED", "Требуется авторизация"));
        var result = await bookings.CreateAsync(userId, request, cancellationToken);
        return result.ErrorCode switch
        {
            null => StatusCode(201, result.Booking),
            "UNAUTHORIZED" => Unauthorized(new ApiError("UNAUTHORIZED", "Требуется повторный вход")),
            "ROOM_NOT_FOUND" => NotFound(new ApiError("ROOM_NOT_FOUND", "Аудитория не найдена", new { roomId = request.RoomId })),
            "VALIDATION_ERROR" => BadRequest(new ApiError("VALIDATION_ERROR", "Начало брони не может быть в прошлом",
                new { startTime = new[] { "Начало брони не может быть в прошлом" } })),
            "BOOKING_CONFLICT" => Conflict(new ApiError("BOOKING_CONFLICT", "Аудитория уже забронирована на это время",
                new { roomId = request.RoomId, date = request.Date, startTime = request.StartTime, endTime = request.EndTime })),
            _ => throw new InvalidOperationException("Unknown booking result.")
        };
    }

    [HttpGet("my")]
    [ProducesResponseType<BookingResponse[]>(200)]
    public async Task<IActionResult> GetMine([FromQuery] MyBookingsQuery query, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
            return Unauthorized(new ApiError("UNAUTHORIZED", "Требуется авторизация"));
        var result = await bookings.GetMineAsync(userId, query, cancellationToken);
        if (result is null)
            return Unauthorized(new ApiError("UNAUTHORIZED", "Требуется повторный вход"));
        return Ok(result);
    }
}
