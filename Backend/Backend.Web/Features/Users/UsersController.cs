using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Web.Features.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Users;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController(UsersService usersService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileRo>> GetMe(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var profile = await usersService.GetProfileAsync(userId, ct);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("me")]
    public async Task<ActionResult<UserProfileRo>> UpdateMe(UpdateUserProfileDto request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var (profile, result) = await usersService.UpdateProfileAsync(userId, request, ct);
        if (result is null)
            return NotFound();

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return Ok(profile);
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}

