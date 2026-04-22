using Backend.Web.Features.Events.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Events;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController(EventsService eventsService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<CreatedAtActionResult> CreateEvent(CreateEventDto request, CancellationToken ct)
    {
        var response = await eventsService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetEventById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventRo>> GetEventById(Guid id, CancellationToken ct)
    {
        var response = await eventsService.GetByIdAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<List<EventRo>>> GetAllEvents(CancellationToken ct, [FromQuery] bool includeArchived = true)
    {
        var response = await eventsService.GetAllAsync(includeArchived, ct);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<ActionResult<EventRo>> UpdateEvent(Guid id, UpdateEventDto request, CancellationToken ct)
    {
        var response = await eventsService.UpdateAsync(id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPatch("{id:guid}/archive")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<IActionResult> ArchiveEvent(Guid id, CancellationToken ct)
    {
        var archived = await eventsService.ArchiveAsync(id, ct);
        return archived ? NoContent() : NotFound();
    }

    [HttpPatch("{id:guid}/unarchive")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<IActionResult> UnarchiveEvent(Guid id, CancellationToken ct)
    {
        var unarchived = await eventsService.UnarchiveAsync(id, ct);
        return unarchived ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        var deleted = await eventsService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}

