using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record EventRo(
    Guid Id,
    string Name,
    string Location,
    LocalDateTime StartDate,
    LocalDateTime EndDate,
    EventStyleRo Style,
    bool IsArchived,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
);

[ExportTsInterface]
public sealed record EventStyleRo(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    Guid? LogoImageId
);
