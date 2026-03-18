using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using MediatR;

namespace Backend.Application.Features.Sessions.Handlers;

public sealed class DeleteSessionHandler(ISessionRepository sessionRepository)
    : IRequestHandler<DeleteSessionRequest, DeleteSessionResponse?>
{
    public async Task<DeleteSessionResponse?> Handle(DeleteSessionRequest request, CancellationToken cancellationToken)
    {
        var deleted = await sessionRepository.DeleteAsync(request.Id, cancellationToken);
        return deleted ? new DeleteSessionResponse(request.Id) : null;
    }
}
