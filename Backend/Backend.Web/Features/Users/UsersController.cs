using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Web.Features.Users.Dtos;
using Backend.Web.Features.Images;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Users;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController(UsersService usersService, IImagesService imagesService) : ControllerBase
{
    private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

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

    [HttpPost("me/photo")]
    public async Task<ActionResult<UserProfileRo>> UploadProfilePhoto(IFormFile file, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        if (file is null || file.Length == 0)
            return BadRequest("Geen bestand toegevoegd.");

        if (!AllowedContentTypes.Contains(file.ContentType))
            return BadRequest("Enkel JPEG, PNG, en WebP afbeeldingen zijn toegestaan.");

        if (file.Length > MaxFileSizeBytes)
            return BadRequest("Grootte van afbeelding mag niet goter zijn dan 5 MB.");

        var imageId = await imagesService.UploadForUserAsync(file, userId, ct);
        var (profile, result) = await usersService.UpdateProfileImageAsync(userId, imageId, ct);
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
