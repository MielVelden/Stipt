using Backend.Database.Entities.Sessions;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionRo(
    Guid Id,
    string Title,
    string? Description,
    SessionType Type,
    string Speaker,
    Guid RoomId,
    SessionRoomRo Room,
    Guid EventId,
    DateTime StartDateTime,
    DateTime EndDateTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    int EnrolledCount,
    int WaitlistCount,
    bool HasAvailableSpots,
    SessionEnrollmentStatus? MyEnrollmentStatus = null,
    int? MyWaitlistPosition = null);

[ExportTsInterface]
public sealed record SessionRoomRo(
    Guid Id,
    string Name,
    int Capacity);
