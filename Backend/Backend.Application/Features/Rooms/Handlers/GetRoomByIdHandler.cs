using Backend.Application.Features.Rooms.Repositories;
using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Handlers;

public sealed class GetRoomByIdHandler(IRoomRepository roomRepository) : IRequestHandler<GetRoomByIdRequest, GetRoomResponse?>
{
    public async Task<GetRoomResponse?> Handle(GetRoomByIdRequest request, CancellationToken ct)
    {
        var room = await roomRepository.GetByIdAsync(request.Id, ct);

        if (room == null)
            throw new Exception($"Ruimte met ID {request.Id} niet gevonden.");

        return new GetRoomResponse(
            room.Id,
            room.Name,
            room.Capacity);
    }
}