using Backend.Domain.Rooms;
using Backend.Web.Features.Rooms.Dtos;
using Backend.Web.Features.Rooms.Repositories;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Services;

public interface IRoomsService
{
    Task<RoomRo> CreateAsync(CreateRoomDto request, CancellationToken cancellationToken);
    Task<List<RoomRo>> GetAllAsync(CancellationToken cancellationToken);
    Task<RoomRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<RoomRo?> UpdateAsync(Guid id, UpdateRoomDto request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class RoomsService(
    IRoomRepository roomRepository,
    IValidator<CreateRoomDto> createRoomValidator,
    IValidator<UpdateRoomDto> updateRoomValidator) : IRoomsService
{
    public async Task<RoomRo> CreateAsync(CreateRoomDto request, CancellationToken cancellationToken)
    {
        await createRoomValidator.ValidateAndThrowAsync(request, cancellationToken);

        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        await roomRepository.CreateAsync(room, cancellationToken);

        return new RoomRo(room.Id, room.Name, room.Capacity);
    }

    public async Task<List<RoomRo>> GetAllAsync(CancellationToken cancellationToken)
    {
        var rooms = await roomRepository.GetAllAsync(cancellationToken);

        return rooms.Select(room => new RoomRo(
            room.Id,
            room.Name,
            room.Capacity)).ToList();
    }

    public async Task<RoomRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var room = await roomRepository.GetByIdAsync(id, cancellationToken);
        return room is null ? null : new RoomRo(room.Id, room.Name, room.Capacity);
    }

    public async Task<RoomRo?> UpdateAsync(Guid id, UpdateRoomDto request, CancellationToken cancellationToken)
    {
        await updateRoomValidator.ValidateAndThrowAsync(request, cancellationToken);

        var room = await roomRepository.GetByIdAsync(id, cancellationToken);

        if (room == null)
            return null;

        room.Name = request.Name.Trim();
        room.Capacity = request.Capacity;

        await roomRepository.UpdateAsync(room, cancellationToken);

        return new RoomRo(room.Id, room.Name, room.Capacity);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await roomRepository.DeleteAsync(id, cancellationToken);
    }
}

