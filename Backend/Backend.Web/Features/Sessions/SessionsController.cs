using System.Security.Claims;
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
        var userIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdRaw is null ? null : Guid.Parse(userIdRaw);

        var response = await sessionsService.GetAllAsync(eventId, userId, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SessionRo>> GetSessionById(Guid eventId, Guid id, CancellationToken ct)
    {
        var userIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdRaw is null ? null : Guid.Parse(userIdRaw);

        var response = await sessionsService.GetByIdAsync(eventId, id, userId, ct);
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

    [HttpPost("{id:guid}/enrollments")]
    public async Task<ActionResult<SessionRo>> EnrollInSession(Guid eventId, Guid id, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();
        
        var response = await sessionsService.EnrollAsync(eventId, id, Guid.Parse(userId), ct);
        return Ok(response);
    }

    [HttpPost("{id:guid}/enrollments/replace/{sessionIdToUnenroll:guid}")]
    public async Task<ActionResult<SessionRo>> ReplaceSessionEnrollment(
        Guid eventId,
        Guid id,
        Guid sessionIdToUnenroll,
        CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();
        
        var response = await sessionsService.ReplaceEnrollmentAsync(eventId, id, Guid.Parse(userId), sessionIdToUnenroll, ct);
        return Ok(response);
    }

    [HttpDelete("{id:guid}/enrollments/me")]
    public async Task<IActionResult> UnenrollFromSession(Guid eventId, Guid id, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();        
        var deleted = await sessionsService.UnenrollAsync(eventId, id, Guid.Parse(userId), ct);
        return deleted ? NoContent() : NotFound();
    }
}
