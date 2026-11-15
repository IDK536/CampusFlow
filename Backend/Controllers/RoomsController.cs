using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Roles = "student,admin")]
[Route("api/rooms")]
[ProducesResponseType<ApiError>(400)]
[ProducesResponseType<ApiError>(401)]
[ProducesResponseType<ApiError>(403)]
public sealed class RoomsController(RoomService rooms) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<RoomResponse[]>(200)]
    public async Task<IActionResult> Search([FromQuery] RoomSearchQuery query, CancellationToken cancellationToken)
    {
        var found = await rooms.GetRoomsAsync(query, cancellationToken);
        if (query.Date is null)
            return Ok(found);
        return Ok(await rooms.GetAvailabilityAsync(found, query.Date, query.StartTime, query.EndTime, cancellationToken));
    }

    [HttpGet("{id}")]
    [ProducesResponseType<RoomResponse>(200)]
    [ProducesResponseType<ApiError>(404)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var room = await rooms.GetRoomAsync(id, cancellationToken);
        if (room is null)
            return NotFound(new ApiError("ROOM_NOT_FOUND", "Аудитория не найдена", new { roomId = id }));
        return Ok(room);
    }

    [HttpGet("{id}/free-slots")]
    [ProducesResponseType<RoomFreeSlotsResponse>(200)]
    [ProducesResponseType<ApiError>(404)]
    public async Task<IActionResult> GetFreeSlots(int id, [FromQuery] RoomDateQuery query, CancellationToken cancellationToken)
    {
        var room = await rooms.GetRoomAsync(id, cancellationToken);
        if (room is null)
            return NotFound(new ApiError("ROOM_NOT_FOUND", "Аудитория не найдена", new { roomId = id }));
        var result = await rooms.GetAvailabilityAsync([room], query.Date!, null, null, cancellationToken);
        return Ok(new RoomFreeSlotsResponse(id, result.Date, result.Rooms[0].FreeSlots));
    }
}
