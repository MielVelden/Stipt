using Backend.Database.Entities.SessionsAttendances;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record ParticipantAttendanceRo(
    Guid ParticipantId,
    string FirstName,
    string LastName,
    string Email,
    SessionAttendanceStatus Status);
