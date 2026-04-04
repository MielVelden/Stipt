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
    public async Task<ActionResult<IReadOnlyCollection<SessionRo>>> GetAllSessions(Guid eventId, [FromQuery] SessionQueryOptions options, CancellationToken ct)
    {
        var response = await sessionsService.GetAllAsync(eventId, options, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SessionRo>> GetSessionById(Guid eventId, Guid id, [FromQuery] SessionQueryOptions options, CancellationToken ct)
    {
        var response = await sessionsService.GetByIdAsync(eventId, id, options, ct);
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
    public async Task<ActionResult<SessionEnrollmentResultRo>> EnrollInSession(Guid eventId, Guid id, EnrollSessionDto request, CancellationToken ct)
    {
        var response = await sessionsService.EnrollAsync(eventId, id, request.ParticipantId, ct);
        return Ok(response);
    }

    [HttpPost("{id:guid}/enrollments/replace")]
    public async Task<ActionResult<SessionEnrollmentResultRo>> ReplaceSessionEnrollment(
        Guid eventId,
        Guid id,
        ReplaceSessionEnrollmentDto request,
        CancellationToken ct)
    {
        var response = await sessionsService.ReplaceEnrollmentAsync(eventId, id, request.ParticipantId, request.SessionIdToUnenroll, ct);
        return Ok(response);
    }

    [HttpDelete("{id:guid}/enrollments/{participantId:guid}")]
    public async Task<IActionResult> UnenrollFromSession(Guid eventId, Guid id, Guid participantId, CancellationToken ct)
    {
        var deleted = await sessionsService.UnenrollAsync(eventId, id, participantId, ct);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("/api/events/{eventId:guid}/agenda")]
    public async Task<ActionResult<IReadOnlyCollection<SessionRo>>> GetMyAgenda(Guid eventId, [FromQuery] Guid participantId, CancellationToken ct)
    {
        var response = await sessionsService.GetAgendaAsync(eventId, participantId, ct);
        return Ok(response);
    }
}
