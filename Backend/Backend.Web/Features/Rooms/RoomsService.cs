using Backend.Domain.Rooms;
using Backend.Web.Features.Rooms.Dtos;
using Backend.Web.Features.Rooms.Repositories;

namespace Backend.Web.Features.Rooms;

public sealed class RoomsService(IRoomRepository roomRepository)
{
    public async Task<RoomRo> CreateAsync(CreateRoomDto request, CancellationToken cancellationToken)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        await roomRepository.CreateAsync(room, cancellationToken);

        return room.ToRo();
    }

    public async Task<List<RoomRo>> GetAllAsync(CancellationToken cancellationToken)
    {
        var rooms = await roomRepository.GetAllAsync(cancellationToken);

        return rooms.Select(room => room.ToRo()).ToList();
    }

    public async Task<RoomRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var room = await roomRepository.GetByIdAsync(id, cancellationToken);
        return room is null ? null : room.ToRo();
    }

    public async Task<RoomRo?> UpdateAsync(Guid id, UpdateRoomDto request, CancellationToken cancellationToken)
    {

        var room = await roomRepository.GetByIdAsync(id, cancellationToken);

        if (room == null)
            return null;

        room.Name = request.Name.Trim();
        room.Capacity = request.Capacity;

        await roomRepository.UpdateAsync(room, cancellationToken);

        return room.ToRo();
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await roomRepository.DeleteAsync(id, cancellationToken);
    }
}

