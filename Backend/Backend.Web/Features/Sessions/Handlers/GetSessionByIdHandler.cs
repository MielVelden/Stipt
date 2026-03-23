using Backend.Web.Features.Sessions.Repositories;
using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Handlers;

public sealed class GetSessionByIdHandler(ISessionRepository sessionRepository)
    : IRequestHandler<GetSessionByIdRequest, GetSessionByIdResponse?>
{
    public async Task<GetSessionByIdResponse?> Handle(GetSessionByIdRequest request, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(request.Id, cancellationToken);
        return session is null
            ? null
            : new GetSessionByIdResponse(
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
                session.UpdatedAtUtc);
    }
}
