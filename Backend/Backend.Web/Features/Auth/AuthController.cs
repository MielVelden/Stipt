using System.Security.Claims;
using Backend.Web.Features.Auth.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(AuthService authService) : ControllerBase
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

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register(RegisterRequest request, CancellationToken ct)
    {
        var result = await authService.RegisterAsync(request, ct);
        if (result is null)
            return Conflict("Email is al in gebruik.");
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }
        
        return NoContent();
    }

    [HttpPost("backoffice/login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> BackofficeLogin(LoginRequest request, CancellationToken ct)
    {
        var response = await authService.LoginAsync(request, ct);
        if (response is null)
            return Unauthorized("Invalid email or password.");

        if (!response.User.Roles.Contains(AppRoles.Manager))
            return StatusCode(StatusCodes.Status403Forbidden);

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
    public async Task<ActionResult> Logout(LogoutRequest request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        await authService.LogoutAsync(userId, request.RefreshToken, ct);
        return NoContent();
    }
}
