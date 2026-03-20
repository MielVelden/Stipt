using Backend.Application.Features.Rooms.Repositories;
using Backend.Application.Features.Rooms.Requests;
using MediatR;

namespace Backend.Application.Features.Rooms.Handlers;

public sealed class DeleteRoomHandler(IRoomRepository roomRepository) : IRequestHandler<DeleteRoomRequest, Unit>
{
    public async Task<Unit> Handle(DeleteRoomRequest request, CancellationToken ct)
    {
        await roomRepository.DeleteAsync(request.Id, ct);

        return Unit.Value;
    }
}