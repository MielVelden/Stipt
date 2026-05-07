namespace Backend.Database.Entities;

public interface IUserRepository
{
    Task<string?> GetEmailByIdAsync(string userId, CancellationToken ct);
}