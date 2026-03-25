using Backend.Web.Features.Rooms.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Rooms;

[ApiController]
[Route("api/events/{eventId:guid}/rooms")]
public class RoomsController(RoomsService roomsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateRoom(Guid eventId, CreateRoomDto request, CancellationToken ct)
    {
        var response = await roomsService.CreateAsync(eventId, request, ct);
        return CreatedAtAction(nameof(GetRoomById), new { eventId, id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<RoomRo>>> GetAllRooms(Guid eventId, CancellationToken ct)
    {
        var response = await roomsService.GetAllAsync(eventId, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoomRo>> GetRoomById(Guid eventId, Guid id, CancellationToken ct)
    {
        var response = await roomsService.GetByIdAsync(eventId, id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RoomRo>> UpdateRoom(Guid eventId, Guid id, UpdateRoomDto request, CancellationToken ct)
    {
        var response = await roomsService.UpdateAsync(eventId, id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRoom(Guid eventId, Guid id, CancellationToken ct)
    {
        await roomsService.DeleteAsync(eventId, id, ct);
        return NoContent();
    }
}

