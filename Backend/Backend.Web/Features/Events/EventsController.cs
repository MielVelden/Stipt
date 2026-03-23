using Backend.Web.Features.Events.Requests;
using Backend.Web.Features.Events.Responses;
using Backend.Web.Features.Events.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Events;

[ApiController]
[Route("api/[controller]")]
public class EventsController(IEventsService eventsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateEvent(CreateEventRequest request, CancellationToken ct)
    {
        var response = await eventsService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetEventById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetEventByIdResponse>> GetEventById(Guid id, CancellationToken ct)
    {
        var response = await eventsService.GetByIdAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<List<GetAllEventsResponse>>> GetAllEvents(CancellationToken ct)
    {
        var response = await eventsService.GetAllAsync(ct);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateEventResponse>> UpdateEvent(Guid id, UpdateEventRequest request, CancellationToken ct)
    {
        var response = await eventsService.UpdateAsync(id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        var deleted = await eventsService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}

