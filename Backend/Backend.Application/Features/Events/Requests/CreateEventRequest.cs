using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Requests;

public sealed record CreateEventRequest(
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    EventStyleDto Style
) : IRequest<CreateEventResponse>;

public sealed record EventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
