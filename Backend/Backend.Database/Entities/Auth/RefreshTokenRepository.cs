using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Auth;

internal sealed class RefreshTokenRepository(ApplicationDbContext dbContext) : IRefreshTokenRepository
{
    public async Task AddAsync(RefreshToken refreshToken, CancellationToken ct)
    {
        await dbContext.RefreshTokens.AddAsync(refreshToken, ct);
        await dbContext.SaveChangesAsync(ct);
    }

    public Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct)
    {
        return dbContext.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == token, ct);
    }

    public async Task RevokeAsync(RefreshToken refreshToken, CancellationToken ct)
    {
        refreshToken.IsRevoked = true;
        dbContext.RefreshTokens.Update(refreshToken);
        await dbContext.SaveChangesAsync(ct);
    }
}
