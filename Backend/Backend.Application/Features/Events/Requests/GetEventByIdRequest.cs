using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Requests;

public sealed record GetEventByIdRequest(Guid Id) : IRequest<GetEventByIdResponse?>;
