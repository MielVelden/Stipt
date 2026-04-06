namespace Backend.Database.Entities.Auth;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken, CancellationToken ct);
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct);
    Task RevokeAsync(RefreshToken refreshToken, CancellationToken ct);
}
