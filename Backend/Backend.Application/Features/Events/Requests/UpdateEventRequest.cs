using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Requests;

public sealed record UpdateEventRequest(
    Guid Id,
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    EventStyleDto Style
) : IRequest<UpdateEventResponse?>;
