using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Requests;

public sealed record CreateEventRequest(
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    CreateEventStyleRequest Style
) : IRequest<CreateEventResponse>;

public sealed record CreateEventStyleRequest(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
