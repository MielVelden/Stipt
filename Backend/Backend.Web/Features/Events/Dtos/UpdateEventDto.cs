using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record UpdateEventDto(
    string Name,
    string Location,
    LocalDateTime StartDate,
    LocalDateTime EndDate,
    UpdateEventStyleDto Style
);

[ExportTsInterface]
public sealed record UpdateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
