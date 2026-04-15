using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record CreateEventDto(
    string Name,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    CreateEventStyleDto Style
);

[ExportTsInterface]
public sealed record CreateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
