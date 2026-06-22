using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record SessionEnrollmentUpdatedMessage(
    Guid SessionId,
    int EnrolledCount,
    int WaitlistCount,
    bool HasAvailableSpots,
    int EffectiveCapacity);
