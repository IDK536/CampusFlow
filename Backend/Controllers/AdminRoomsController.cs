using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = AdminAccessRequirement.Policy)]
[Route("api/admin/rooms")]
[ProducesResponseType<ApiError>(400)]
[ProducesResponseType(404)]
public sealed class AdminRoomsController(RoomService rooms) : ControllerBase
{
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType<ApiError>(404)]
    [ProducesResponseType<ApiError>(409)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var error = await rooms.DeleteAsync(id, cancellationToken);
        return error switch
        {
            null => NoContent(),
            "ROOM_NOT_FOUND" => NotFound(new ApiError("ROOM_NOT_FOUND", "Аудитория не найдена", new { roomId = id })),
            "ROOM_HAS_BOOKINGS" => Conflict(new ApiError("ROOM_HAS_BOOKINGS", "Нельзя удалить аудиторию с историей бронирований", new { roomId = id })),
            _ => throw new InvalidOperationException("Unknown room deletion result.")
        };
    }

    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType<RoomResponse>(201)]
    public async Task<IActionResult> Create(RoomWriteRequest request, CancellationToken cancellationToken)
    {
        var result = await rooms.SaveAsync(null, request, cancellationToken);
        return result.ErrorCode switch
        {
            null => CreatedAtAction(nameof(RoomsController.GetById), "Rooms", new { id = result.Room!.Id }, result.Room),
            "DUPLICATE_NAME" => BadRequest(new ApiError("VALIDATION_ERROR", "Некорректные данные запроса",
                new { name = new[] { "Аудитория с таким названием уже существует" } })),
            _ => throw new InvalidOperationException("Unknown room creation result.")
        };
    }

    [HttpPut("{id}")]
    [Consumes("application/json")]
    [ProducesResponseType<RoomResponse>(200)]
    [ProducesResponseType<ApiError>(404)]
    public async Task<IActionResult> Update(int id, RoomWriteRequest request, CancellationToken cancellationToken)
    {
        var result = await rooms.SaveAsync(id, request, cancellationToken);
        return result.ErrorCode switch
        {
            null => Ok(result.Room),
            "ROOM_NOT_FOUND" => NotFound(new ApiError("ROOM_NOT_FOUND", "Аудитория не найдена", new { roomId = id })),
            "DUPLICATE_NAME" => BadRequest(new ApiError("VALIDATION_ERROR", "Некорректные данные запроса",
                new { name = new[] { "Аудитория с таким названием уже существует" } })),
            _ => throw new InvalidOperationException("Unknown room update result.")
        };
    }
}
