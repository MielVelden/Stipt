using System.Security.Claims;
using Backend.Web.Features.EventParticipants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.EventParticipants;

[ApiController]
[Route("api/invites")]
[Authorize]
public class InvitesController(EventParticipantsService eventParticipantsService) : ControllerBase
{
    [HttpGet("{token}")]
    public async Task<ActionResult<InviteDetailsRo>> GetInviteDetails(string token, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var details = await eventParticipantsService.GetInviteDetailsAsync(token, userId, ct);
        return Ok(details);
    }

    [HttpPost("{token}/redeem")]
    public async Task<IActionResult> RedeemInvite(string token, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        await eventParticipantsService.RedeemInviteAsync(token, userId, ct);
        return NoContent();
    }
}
