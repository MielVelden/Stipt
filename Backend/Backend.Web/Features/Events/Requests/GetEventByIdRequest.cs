using Backend.Web.Features.Events.Responses;
using MediatR;

namespace Backend.Web.Features.Events.Requests;

public sealed record GetEventByIdRequest(Guid Id) : IRequest<GetEventByIdResponse?>;
