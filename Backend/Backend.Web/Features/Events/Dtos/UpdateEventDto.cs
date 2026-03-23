using Backend.Common.Application.Models;

namespace Backend.Web.Features.Events.Dtos;

public sealed record UpdateEventDto(
    Optional<string> Name,
    Optional<string> Location,
    Optional<DateTimeOffset> StartDate,
    Optional<DateTimeOffset> EndDate,
    Optional<UpdateEventStyleDto> Style,
    Optional<bool> IsArchived
);

public sealed record UpdateEventStyleDto(
    Optional<string> PrimaryBackgroundColor,
    Optional<string> PrimaryForegroundColor,
    Optional<string?> LogoImageUrl
);

