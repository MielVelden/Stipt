using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record CreateEventDto(
    string Name,
    string Location,
    LocalDateTime StartDate,
    LocalDateTime EndDate,
    CreateEventStyleDto Style
);

[ExportTsInterface]
public sealed record CreateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    Guid? LogoImageId
);
