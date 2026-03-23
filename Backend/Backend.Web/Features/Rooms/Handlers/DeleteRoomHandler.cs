using Backend.Web.Features.Rooms.Repositories;
using Backend.Web.Features.Rooms.Requests;
using MediatR;

namespace Backend.Web.Features.Rooms.Handlers;

public sealed class DeleteRoomHandler(IRoomRepository roomRepository) : IRequestHandler<DeleteRoomRequest, Unit>
{
    public async Task<Unit> Handle(DeleteRoomRequest request, CancellationToken ct)
    {
        await roomRepository.DeleteAsync(request.Id, ct);

        return Unit.Value;
    }
}