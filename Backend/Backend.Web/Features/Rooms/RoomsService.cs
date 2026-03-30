using Backend.Database.Entities.Rooms;
using Backend.Web.Features.Rooms.Dtos;

namespace Backend.Web.Features.Rooms;

public sealed class RoomsService(IRoomRepository roomRepository)
{
    public async Task<RoomRo> CreateAsync(Guid eventId, CreateRoomDto request, CancellationToken cancellationToken)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity,
            EventId = eventId
        };

        await roomRepository.CreateAsync(room, cancellationToken);

        return room.ToRo();
    }

    public async Task<List<RoomRo>> GetAllAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var rooms = await roomRepository.GetAllAsync(eventId, cancellationToken);

        return rooms.Select(room => room.ToRo()).ToList();
    }

    public async Task<RoomRo?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        var room = await roomRepository.GetByIdAsync(eventId, id, cancellationToken);
        return room is null ? null : room.ToRo();
    }

    public async Task<RoomRo?> UpdateAsync(Guid eventId, Guid id, UpdateRoomDto request, CancellationToken cancellationToken)
    {
        var room = await roomRepository.GetByIdAsync(eventId, id, cancellationToken);

        if (room == null)
            return null;

        room.Name = request.Name.Trim();
        room.Capacity = request.Capacity;
        room.EventId = eventId;

        await roomRepository.UpdateAsync(room, cancellationToken);

        return room.ToRo();
    }

    public async Task DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        await roomRepository.DeleteAsync(eventId, id, cancellationToken);
    }
}

