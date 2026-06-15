using Backend.Database.Entities.Sessions;

namespace Backend.Database.Entities.SessionsAttendances;

public sealed class SessionAttendance
{
    public Guid Id { get; init; }
    public Guid SessionId { get; init; }
    public Session Session { get; init; } = null!;
    public Guid ParticipantId { get; init; }
    public SessionAttendanceStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}
