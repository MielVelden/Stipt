using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record ReplaceSessionEnrollmentDto(Guid ParticipantId, Guid SessionIdToUnenroll);

