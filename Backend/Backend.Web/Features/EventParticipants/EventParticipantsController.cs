using Backend.Web.Features.EventParticipants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.EventParticipants;

[ApiController]
[Route("api/events/{eventId:guid}/participants")]
[Authorize(Roles = AppRoles.Manager)]
public class EventParticipantsController(EventParticipantsService eventParticipantsService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateEventParticipant(Guid eventId, CreateEventParticipantDto request, CancellationToken ct)
    {
        var response = await eventParticipantsService.CreateAsync(eventId, request, ct);
        return CreatedAtAction(nameof(GetEventParticipantByEmail), new { eventId, email = response.Email }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<EventParticipantRo>>> GetAllEventParticipants(Guid eventId, CancellationToken ct)
    {
        var response = await eventParticipantsService.GetAllByEventIdAsync(eventId, ct);
        return Ok(response);
    }

    [HttpGet("{email}")]
    public async Task<ActionResult<EventParticipantRo>> GetEventParticipantByEmail(Guid eventId, string email, CancellationToken ct)
    {
        var response = await eventParticipantsService.GetByEventIdAndEmailAsync(eventId, email, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{email}")]
    public async Task<IActionResult> DeleteEventParticipant(Guid eventId, string email, CancellationToken ct)
    {
        var deleted = await eventParticipantsService.DeleteAsync(eventId, email, ct);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("/api/participants/{email}")]
    public async Task<ActionResult<List<EventParticipantRo>>> GetEventsByEmail(string email, CancellationToken ct)
    {
        var response = await eventParticipantsService.GetEventsByEmailAsync(email, ct);
        return Ok(response);
    }
}
