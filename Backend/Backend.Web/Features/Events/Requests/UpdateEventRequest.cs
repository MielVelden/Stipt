using Backend.Web.Features.Events.Responses;
using Backend.Common.Application.Models;
using MediatR;

namespace Backend.Web.Features.Events.Requests;

public sealed record UpdateEventRequest(
    Optional<string> Name,
    Optional<string> Location,
    Optional<DateTimeOffset> StartDate,
    Optional<DateTimeOffset> EndDate,
    Optional<UpdateEventStyleRequest> Style,
    Optional<bool> IsArchived
);

public sealed record UpdateEventStyleRequest(
    Optional<string> PrimaryBackgroundColor,
    Optional<string> PrimaryForegroundColor,
    Optional<string?> LogoImageUrl
);

public sealed record UpdateEventCommand(
    Guid Id,
    UpdateEventRequest Request
) : IRequest<UpdateEventResponse?>;
