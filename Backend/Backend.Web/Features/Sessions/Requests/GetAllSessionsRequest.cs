using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Requests;

public sealed record GetAllSessionsRequest() : IRequest<IReadOnlyCollection<GetAllSessionsResponse>>;
