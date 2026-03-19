using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using MediatR;

namespace Backend.Application.Features.Sessions.Handlers;

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
                session.Tags.AsReadOnly(),
                session.IsArchived,
                session.CreatedAtUtc,
                session.UpdatedAtUtc);
    }
}
