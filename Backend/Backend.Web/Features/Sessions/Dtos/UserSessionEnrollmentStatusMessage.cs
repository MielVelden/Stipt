using Backend.Database.Entities.SessionEnrollments;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record UserSessionEnrollmentStatusMessage(
    Guid SessionId,
    SessionEnrollmentStatus? EnrollmentStatus,
    int? WaitlistPosition);
