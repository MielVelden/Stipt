using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Speakers.Dtos;

[ExportTsInterface]
public sealed record UpdateSpeakerDto(
    string Name,
    string? Title,
    string? Company,
    string? Bio,
    Guid? PhotoId);
