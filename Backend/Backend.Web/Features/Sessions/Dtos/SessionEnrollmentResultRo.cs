using Backend.Database.Entities.Sessions;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionEnrollmentResultRo(
    Guid SessionId,
    Guid ParticipantId,
    SessionEnrollmentStatus Status,
    int? WaitlistPosition,
    int EnrolledCount,
    int WaitlistCount,
    bool HasAvailableSpots);

[ExportTsInterface]
public sealed record ConflictingSessionRo(
    Guid Id,
    string Title,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string RoomName);

