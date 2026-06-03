using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Speakers.Dtos;

[ExportTsInterface]
public sealed record SpeakerRo(
    Guid Id,
    string Name,
    string? Title,
    string? Company,
    string? Bio,
    Guid EventId,
    Guid? PhotoId,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
