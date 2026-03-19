using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using MediatR;

namespace Backend.Application.Features.Sessions.Handlers;

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
                session.Tags.AsReadOnly(),
                session.CreatedAtUtc,
                session.UpdatedAtUtc))
            .ToArray();
    }
}
