using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateRoom(CreateRoomRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request, ct);
        return CreatedAtAction(nameof(GetRoomById), new { id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<GetRoomResponse>>> GetAllRooms(CancellationToken ct)
    {
        var response = await sender.Send(new GetAllRoomsRequest(), ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetRoomResponse>> GetRoomById(Guid id, CancellationToken ct)
    {
        var response = await sender.Send(new GetRoomByIdRequest(id), ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateRoomResponse>> UpdateRoom(Guid id, UpdateRoomRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request with { Id = id }, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRoom(Guid id, CancellationToken ct)
    {
        await sender.Send(new DeleteRoomRequest(id), ct);
        return NoContent();
    }
}

