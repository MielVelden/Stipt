using Backend.Database.Entities;
using Backend.Web.Features.Auth.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(
    SignInManager<ApplicationUser> signInManager,
    AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var response = await authService.LoginAsync(request, ct);
        if (response is null)
            return Unauthorized("Invalid email or password.");

        return Ok(response);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<RefreshResponse>> Refresh(RefreshRequest request, CancellationToken ct)
    {
        var response = await authService.RefreshAsync(request.RefreshToken, ct);
        if (response is null)
            return Unauthorized("Invalid or expired refresh token.");

        return Ok(response);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }
}