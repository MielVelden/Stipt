using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Requests;

public sealed record DeleteSessionRequest(Guid Id) : IRequest<DeleteSessionResponse?>;
