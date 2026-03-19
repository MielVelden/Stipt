using Backend.Application.Features.Sessions.Responses;
using MediatR;

namespace Backend.Application.Features.Sessions.Requests;

public sealed record DeleteSessionRequest(Guid Id) : IRequest<DeleteSessionResponse?>;
