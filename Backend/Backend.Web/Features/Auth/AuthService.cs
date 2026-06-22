using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Database.Entities;
using Backend.Database.Entities.Auth;
using Backend.Web.Features.Auth.Dtos;
using Backend.Web.Features.Users.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using NodaTime;

namespace Backend.Web.Features.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IRefreshTokenRepository refreshTokenRepository,
    IConfiguration configuration,
    IClock clock)
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return null;

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return null;

        if (string.IsNullOrEmpty(user.Email))
            return null;

        var roles = await userManager.GetRolesAsync(user);
        var userRo = new UserRo(Guid.Parse(user.Id), user.Email, user.FirstName, user.LastName, roles);

        var accessToken = CreateAccessToken(user, roles);
        var refreshToken = await CreateAndSaveRefreshTokenAsync(user.Id, ct);

        return new LoginResponse(accessToken, refreshToken, userRo);
    }

    public async Task<IdentityResult?> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
            return null;

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return result;

        var roleResult = await userManager.AddToRoleAsync(user, AppRoles.Attendee);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return roleResult;
        }

        return IdentityResult.Success;
    }

    public async Task LogoutAsync(string userId, string refreshToken, CancellationToken ct)
    {
        var token = await refreshTokenRepository.GetByTokenAsync(refreshToken, ct);
        if (token is null || token.UserId != userId || token.IsRevoked)
            return;

        await refreshTokenRepository.RevokeAsync(token, ct);
    }

    public async Task<RefreshResponse?> RefreshAsync(string token, CancellationToken ct)
    {
        var refreshToken = await refreshTokenRepository.GetByTokenAsync(token, ct);

        if (refreshToken is null || refreshToken.IsRevoked || refreshToken.ExpiresAt <= clock.GetCurrentInstant())
            return null;

        var user = refreshToken.User;
        var roles = await userManager.GetRolesAsync(user);

        var newAccessToken = CreateAccessToken(user, roles);
        var newRefreshToken = await CreateAndSaveRefreshTokenAsync(user.Id, ct);

        await refreshTokenRepository.RevokeAsync(refreshToken, ct);

        return new RefreshResponse(newAccessToken, newRefreshToken);
    }

    private string CreateAccessToken(ApplicationUser user, IList<string> roles)
    {
        var secretKey = configuration["Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("Jwt:SecretKey is not configured. Set it via user-secrets or environment variables.");

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = [
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            ..roles.Select(role => new Claim(ClaimTypes.Role, role))
        ];

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(configuration.GetValue<int>("Jwt:ExpirationInMinutes")),
            SigningCredentials = credentials,
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
        };

        return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
    }

    private async Task<string> CreateAndSaveRefreshTokenAsync(string userId, CancellationToken ct)
    {
        var tokenBytes = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(tokenBytes);
        var now = clock.GetCurrentInstant();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = token,
            UserId = userId,
            CreatedAt = now,
            ExpiresAt = now.Plus(Duration.FromDays(7)),
        };

        await refreshTokenRepository.AddAsync(refreshToken, ct);

        return token;
    }
}
