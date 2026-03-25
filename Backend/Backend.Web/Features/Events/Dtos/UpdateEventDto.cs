using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record UpdateEventDto(
    string Name,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    UpdateEventStyleDto Style
);

[ExportTsInterface]
public sealed record UpdateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
