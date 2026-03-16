using Backend.Application.Features.Rooms.Repositories;
using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using Backend.Domain.Rooms;
using MediatR;

namespace Backend.Application.Features.Rooms.Handlers;

public sealed class CreateRoomHandler(IRoomRepository roomRepository) : IRequestHandler<CreateRoomRequest, CreateRoomResponse>
{
    public async Task<CreateRoomResponse> Handle(CreateRoomRequest request, CancellationToken ct)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        await roomRepository.CreateAsync(room, ct);

        return new CreateRoomResponse(room.Id, room.Name, room.Capacity);
    }
}