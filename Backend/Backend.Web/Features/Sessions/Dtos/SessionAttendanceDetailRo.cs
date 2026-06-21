using Backend.Database.Entities.Sessions;
using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionAttendanceDetailRo(
    Guid SessionId,
    string SessionTitle,
    SessionType SessionType,
    string RoomName,
    LocalDateTime StartDateTime,
    LocalDateTime EndDateTime,
    IReadOnlyList<string> Labels,
    int EnrollmentCount,
    int PresentCount,
    int AbsentCount,
    int UnknownCount,
    IReadOnlyList<ParticipantAttendanceRo> Participants);
