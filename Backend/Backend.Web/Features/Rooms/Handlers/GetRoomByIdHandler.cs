using Backend.Web.Features.Rooms.Repositories;
using Backend.Web.Features.Rooms.Requests;
using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Handlers;

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