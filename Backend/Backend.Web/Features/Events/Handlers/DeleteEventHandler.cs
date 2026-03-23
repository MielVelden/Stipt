using Backend.Web.Features.Events.Repositories;
using Backend.Web.Features.Events.Requests;
using MediatR;

namespace Backend.Web.Features.Events.Handlers;

public sealed class DeleteEventHandler(IEventRepository eventRepository) 
    : IRequestHandler<DeleteEventRequest, bool>
{
    public async Task<bool> Handle(DeleteEventRequest request, CancellationToken cancellationToken)
    {
        return await eventRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
