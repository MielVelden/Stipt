using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionAttendanceRo(
    Guid SessionId,
    string SessionTitle,
    int EnrollmentCount,
    int PresentCount,
    int AbsentCount,
    int UnknownCount);
