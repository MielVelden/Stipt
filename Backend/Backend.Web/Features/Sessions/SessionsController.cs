using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using Backend.Web.Features.Sessions.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController(ISessionsService sessionsService) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateSession(CreateSessionRequest request, CancellationToken ct)
    {
        var response = await sessionsService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetSessionById), new { id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<GetAllSessionsResponse>>> GetAllSessions(CancellationToken ct)
    {
        var response = await sessionsService.GetAllAsync(ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetSessionByIdResponse>> GetSessionById(Guid id, CancellationToken ct)
    {
        var response = await sessionsService.GetByIdAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateSessionResponse>> UpdateSession(Guid id, UpdateSessionRequest request, CancellationToken ct)
    {
        var response = await sessionsService.UpdateAsync(id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteSessionResponse>> DeleteSession(Guid id, CancellationToken ct)
    {
        var response = await sessionsService.DeleteAsync(id, ct);
        return response is null ? NotFound() : Ok(response);
    }
}
