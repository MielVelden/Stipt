using NodaTime;

namespace Backend.Database.Entities.Auth;

public sealed class RefreshToken
{
    public Guid Id { get; init; }
    public required string Token { get; init; }
    public required string UserId { get; init; }
    public Instant ExpiresAt { get; init; }
    public Instant CreatedAt { get; init; }
    public bool IsRevoked { get; set; }

    public ApplicationUser User { get; init; } = null!;
}
