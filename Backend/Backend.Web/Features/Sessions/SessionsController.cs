using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateSession(CreateSessionRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request, ct);
        return CreatedAtAction(nameof(GetSessionById), new { id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<GetAllSessionsResponse>>> GetAllSessions(CancellationToken ct)
    {
        var response = await sender.Send(new GetAllSessionsRequest(), ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetSessionByIdResponse>> GetSessionById(Guid id, CancellationToken ct)
    {
        var response = await sender.Send(new GetSessionByIdRequest(id), ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateSessionResponse>> UpdateSession(Guid id, UpdateSessionRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request with { Id = id }, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteSessionResponse>> DeleteSession(Guid id, CancellationToken ct)
    {
        var response = await sender.Send(new DeleteSessionRequest(id), ct);
        return response is null ? NotFound() : Ok(response);
    }
}
