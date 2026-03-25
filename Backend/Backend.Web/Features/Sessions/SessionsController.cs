using Backend.Web.Features.Sessions.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Sessions;

[ApiController]
[Route("api/events/{eventId:guid}/sessions")]
public class SessionsController(SessionsService sessionsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateSession(Guid eventId, CreateSessionDto request, CancellationToken ct)
    {
        var response = await sessionsService.CreateAsync(eventId, request, ct);
        return CreatedAtAction(nameof(GetSessionById), new { eventId, id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<SessionRo>>> GetAllSessions(Guid eventId, CancellationToken ct)
    {
        var response = await sessionsService.GetAllAsync(eventId, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SessionRo>> GetSessionById(Guid eventId, Guid id, CancellationToken ct)
    {
        var response = await sessionsService.GetByIdAsync(eventId, id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SessionRo>> UpdateSession(Guid eventId, Guid id, UpdateSessionDto request, CancellationToken ct)
    {
        var response = await sessionsService.UpdateAsync(eventId, id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSession(Guid eventId, Guid id, CancellationToken ct)
    {
        var deleted = await sessionsService.DeleteAsync(eventId, id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
