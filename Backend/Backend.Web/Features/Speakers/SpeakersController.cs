using Backend.Web.Configuration;
using Backend.Web.Features.Speakers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Speakers;

[ApiController]
[Route("api/events/{eventId:guid}/speakers")]
[Authorize]
[ServiceFilter(typeof(EventParticipantAuthorizationFilter))]
public class SpeakersController(SpeakersService speakersService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<CreatedAtActionResult> CreateSpeaker(Guid eventId, CreateSpeakerDto request, CancellationToken ct)
    {
        var response = await speakersService.CreateAsync(eventId, request, ct);
        return CreatedAtAction(nameof(GetSpeakerById), new { eventId, id = response.Id }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<SpeakerRo>>> GetAllSpeakers(Guid eventId, CancellationToken ct)
    {
        var response = await speakersService.GetAllAsync(eventId, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SpeakerRo>> GetSpeakerById(Guid eventId, Guid id, CancellationToken ct)
    {
        var response = await speakersService.GetByIdAsync(eventId, id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<ActionResult<SpeakerRo>> UpdateSpeaker(Guid eventId, Guid id, UpdateSpeakerDto request, CancellationToken ct)
    {
        var response = await speakersService.UpdateAsync(eventId, id, request, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<IActionResult> DeleteSpeaker(Guid eventId, Guid id, CancellationToken ct)
    {
        var deleted = await speakersService.DeleteAsync(eventId, id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
