namespace Backend.Web.Features.Events.Dtos;

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

public sealed record EventStyleRo(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
