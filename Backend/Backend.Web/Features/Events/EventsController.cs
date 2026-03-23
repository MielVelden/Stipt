using Backend.Application.Features.Events.Requests;
using Backend.Application.Features.Events.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Events;

[ApiController]
[Route("api/[controller]")]
public class EventsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateEvent(CreateEventRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request, ct);
        return CreatedAtAction(nameof(GetEventById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetEventByIdResponse>> GetEventById(Guid id, CancellationToken ct)
    {
        var response = await sender.Send(new GetEventByIdRequest(id), ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<List<GetAllEventsResponse>>> GetAllEvents(CancellationToken ct)
    {
        var response = await sender.Send(new GetAllEventsRequest(), ct);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateEventResponse>> UpdateEvent(Guid id, UpdateEventRequest request, CancellationToken ct)
    {
        var response = await sender.Send(new UpdateEventCommand(id, request), ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        var deleted = await sender.Send(new DeleteEventRequest(id), ct);
        return deleted ? NoContent() : NotFound();
    }
}

