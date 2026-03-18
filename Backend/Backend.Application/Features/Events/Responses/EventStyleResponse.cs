namespace Backend.Application.Features.Events.Responses;

public sealed record EventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
