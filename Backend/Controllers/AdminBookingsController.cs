using System.Globalization;
using System.Security.Claims;
using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = AdminAccessRequirement.Policy)]
[Route("api/admin/bookings")]
[ProducesResponseType<ApiError>(400)]
[ProducesResponseType(404)]
public sealed class AdminBookingsController(BookingService bookings) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<BookingResponse[]>(200)]
    public async Task<IActionResult> GetAll([FromQuery] AdminBookingsQuery query, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var adminId) || adminId <= 0)
            return NotFound();
        var result = await bookings.GetAllAsync(adminId, query, cancellationToken);
        if (result is null)
            return NotFound();
        Response.Headers["X-Total-Count"] = result.TotalCount.ToString(CultureInfo.InvariantCulture);
        Response.Headers["X-Active-Count"] = result.ActiveCount.ToString(CultureInfo.InvariantCulture);
        return Ok(result.Bookings);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType<BookingCancellationResponse>(200)]
    [ProducesResponseType<ApiError>(404)]
    [ProducesResponseType<ApiError>(409)]
    public async Task<IActionResult> Cancel(int id, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var adminId) || adminId <= 0)
            return NotFound();
        var error = await bookings.CancelAsync(adminId, id, cancellationToken, asAdmin: true);
        return error switch
        {
            null => Ok(new BookingCancellationResponse(id, "cancelled")),
            "UNAUTHORIZED" => NotFound(),
            "BOOKING_NOT_FOUND" => NotFound(new ApiError("BOOKING_NOT_FOUND", "Бронь не найдена", new { bookingId = id })),
            "ALREADY_CANCELLED" => Conflict(new ApiError("ALREADY_CANCELLED", "Бронь уже отменена", new { bookingId = id })),
            _ => throw new InvalidOperationException("Unknown cancellation result.")
        };
    }
}
