using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionEnrollmentUpdateRo(
    Guid SessionId,
    int EnrolledCount,
    int WaitlistCount,
    bool HasAvailableSpots,
    int EffectiveCapacity);
