using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Speakers.Dtos;

[ExportTsInterface]
public sealed record CreateSpeakerDto(
    string Name,
    string? Title,
    string? Company,
    string? Bio,
    Guid? PhotoId);
