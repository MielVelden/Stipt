using System.Security.Claims;
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
        if (!User.IsInRole(AppRoles.Attendee))
        {
            var response = await eventsService.GetByIdAsync(id, ct);
            return response is null ? NotFound() : Ok(response);
        }

        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (userEmail is null) return Unauthorized();

        var attendeeResponse = await eventsService.GetByIdForAttendeeAsync(id, userEmail, ct);
        return attendeeResponse is null ? NotFound() : Ok(attendeeResponse);
    }

    [HttpGet]
    public async Task<ActionResult<List<EventRo>>> GetAllEvents(CancellationToken ct, [FromQuery] bool includeArchived = true)
    {
        if (!User.IsInRole(AppRoles.Attendee))
            return Ok(await eventsService.GetAllAsync(includeArchived, ct));

        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (userEmail is null) return Unauthorized();

        return Ok(await eventsService.GetAllForAttendeeAsync(userEmail, includeArchived, ct));
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

