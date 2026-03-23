using Backend.Web.Features.Rooms.Requests;
using Backend.Web.Features.Rooms.Responses;
using Backend.Web.Features.Rooms.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController(IRoomsService roomsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateRoom(CreateRoomRequest request, CancellationToken ct)
    {
        var response = await roomsService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetRoomById), new { id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<GetRoomResponse>>> GetAllRooms(CancellationToken ct)
    {
        var response = await roomsService.GetAllAsync(ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetRoomResponse>> GetRoomById(Guid id, CancellationToken ct)
    {
        var response = await roomsService.GetByIdAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateRoomResponse>> UpdateRoom(Guid id, UpdateRoomRequest request, CancellationToken ct)
    {
        var response = await roomsService.UpdateAsync(id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRoom(Guid id, CancellationToken ct)
    {
        await roomsService.DeleteAsync(id, ct);
        return NoContent();
    }
}

