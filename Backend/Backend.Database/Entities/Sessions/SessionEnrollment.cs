namespace Backend.Database.Entities.Sessions;

public sealed class SessionEnrollment
{
    public Guid Id { get; init; }
    public Guid SessionId { get; init; }
    public Session Session { get; init; } = null!;
    public Guid ParticipantId { get; init; }
    public SessionEnrollmentStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}
