using Backend.Database.Entities;
using Backend.Web.Features.Auth.Dtos;
using Backend.Web.Features.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(
    UserManager<ApplicationUser> userManager, 
    SignInManager<ApplicationUser> signInManager) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (user.Email == null || user.Email == string.Empty)
        {
            return BadRequest("User email is not set.");
        }

        var roles = await userManager.GetRolesAsync(user);

        var userRo = new UserRo(
            Guid.Parse(user.Id), 
            user.Email, 
            user.FirstName, 
            user.LastName, 
            roles);

        var accessToken = "dummy-jwt-token"; // TODO: Implement JWT token generation
            
        return Ok(new LoginResponse(accessToken, userRo));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }
}