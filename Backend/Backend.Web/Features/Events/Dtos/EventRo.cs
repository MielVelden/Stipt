using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Events.Dtos;

[ExportTsInterface]
public sealed record EventRo(
    Guid Id,
    string Name,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    EventStyleRo Style,
    bool IsArchived,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
);

[ExportTsInterface]
public sealed record EventStyleRo(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
