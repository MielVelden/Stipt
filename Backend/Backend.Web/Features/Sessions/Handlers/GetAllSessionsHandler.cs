using Backend.Web.Features.Sessions.Repositories;
using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Handlers;

public sealed class GetAllSessionsHandler(ISessionRepository sessionRepository)
    : IRequestHandler<GetAllSessionsRequest, IReadOnlyCollection<GetAllSessionsResponse>>
{
    public async Task<IReadOnlyCollection<GetAllSessionsResponse>> Handle(GetAllSessionsRequest request, CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(cancellationToken);
        return sessions
            .Select(session => new GetAllSessionsResponse(
                session.Id,
                session.Title,
                session.Description,
                session.Speaker,
                session.Room,
                session.StartTime,
                session.EndTime,
                session.Capacity,
                session.Labels.AsReadOnly(),
                session.CreatedAtUtc,
                session.UpdatedAtUtc))
            .ToArray();
    }
}
