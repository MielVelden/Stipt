using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController(ISessionsService sessionsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateSession(CreateSessionDto request, CancellationToken ct)
    {
        var response = await sessionsService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetSessionById), new { id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<SessionRo>>> GetAllSessions(CancellationToken ct)
    {
        var response = await sessionsService.GetAllAsync(ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SessionRo>> GetSessionById(Guid id, CancellationToken ct)
    {
        var response = await sessionsService.GetByIdAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SessionRo>> UpdateSession(Guid id, UpdateSessionDto request, CancellationToken ct)
    {
        var response = await sessionsService.UpdateAsync(id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteSessionRo>> DeleteSession(Guid id, CancellationToken ct)
    {
        var response = await sessionsService.DeleteAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }
}
