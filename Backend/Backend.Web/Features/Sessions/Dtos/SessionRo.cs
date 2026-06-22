using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.SessionEnrollments;
using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionRo(
    Guid Id,
    string Title,
    string? Description,
    SessionType Type,
    IReadOnlyCollection<SessionSpeakerRo> Speakers,
    Guid RoomId,
    SessionRoomRo Room,
    Guid EventId,
    LocalDateTime StartDateTime,
    LocalDateTime EndDateTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    int EffectiveCapacity,
    int EnrolledCount,
    int WaitlistCount,
    bool HasAvailableSpots,
    SessionEnrollmentStatus? MyEnrollmentStatus = null,
    int? MyWaitlistPosition = null,
    Guid? CoverImageId = null);

[ExportTsInterface]
public sealed record SessionRoomRo(
    Guid Id,
    string Name,
    int Capacity);

[ExportTsInterface]
public sealed record SessionSpeakerRo(
    Guid Id,
    string Name,
    string? Title,
    Guid? PhotoId);
