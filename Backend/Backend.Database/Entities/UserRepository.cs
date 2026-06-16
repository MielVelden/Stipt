using Backend.Database.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Backend.Database.Entities;

internal sealed class UserRepository(ApplicationDbContext dbContext) : IUserRepository
{
    private readonly UserManager<ApplicationUser> _userManager = dbContext.GetService<UserManager<ApplicationUser>>();
    
    public Task<string?> GetEmailByIdAsync(string userId, CancellationToken ct)
    {
        return _userManager.Users
            .Where(u => u.Id.Equals(userId))
            .Select(u => u.Email)
            .FirstOrDefaultAsync(cancellationToken: ct);
    }

    public async Task<IReadOnlyList<ApplicationUser>> GetByIdsAsync(IReadOnlyList<string> userIds, CancellationToken ct)
    {
        return await _userManager.Users
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync(ct);
    }
}