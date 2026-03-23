using Backend.Web.Features.Sessions.Repositories;
using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Handlers;

public sealed class DeleteSessionHandler(ISessionRepository sessionRepository)
    : IRequestHandler<DeleteSessionRequest, DeleteSessionResponse?>
{
    public async Task<DeleteSessionResponse?> Handle(DeleteSessionRequest request, CancellationToken cancellationToken)
    {
        var deleted = await sessionRepository.DeleteAsync(request.Id, cancellationToken);
        return deleted ? new DeleteSessionResponse(request.Id) : null;
    }
}
