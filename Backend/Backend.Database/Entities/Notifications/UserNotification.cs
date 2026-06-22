namespace Backend.Database.Entities.Notifications;

public sealed class UserNotification
{
    public Guid Id { get; init; }
    public required string UserId { get; init; }
    public required string Type { get; init; }
    public required string Title { get; init; }
    public required string Message { get; init; }
    public Guid? EventId { get; init; }
    public Guid? SessionId { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? ReadAtUtc { get; set; }

    public ApplicationUser User { get; init; } = null!;
}

