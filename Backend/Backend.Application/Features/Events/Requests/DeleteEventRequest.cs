using MediatR;

namespace Backend.Application.Features.Events.Requests;

public sealed record DeleteEventRequest(Guid Id) : IRequest<bool>;
