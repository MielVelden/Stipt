using Backend.Application.Features.Rooms.Repositories;
using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Handlers;

public sealed class UpdateRoomHandler(IRoomRepository roomRepository) : IRequestHandler<UpdateRoomRequest, UpdateRoomResponse>
{
    public async Task<UpdateRoomResponse> Handle(UpdateRoomRequest request, CancellationToken ct)
    {
        var room = await roomRepository.GetByIdAsync(request.Id, ct);

        if (room == null)
            throw new Exception($"Ruimte met ID {request.Id} niet gevonden.");
        

        room.Name = request.Name.Trim();
        room.Capacity = request.Capacity;

        await roomRepository.UpdateAsync(room, ct);

        return new UpdateRoomResponse(room.Id, room.Name, room.Capacity);
    }
}