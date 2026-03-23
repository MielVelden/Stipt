using Backend.Domain.Rooms;
using Backend.Web.Features.Rooms.Repositories;
using Backend.Web.Features.Rooms.Requests;
using Backend.Web.Features.Rooms.Responses;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Services;

public interface IRoomsService
{
    Task<CreateRoomResponse> CreateAsync(CreateRoomRequest request, CancellationToken cancellationToken);
    Task<List<GetRoomResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<GetRoomResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<UpdateRoomResponse?> UpdateAsync(Guid id, UpdateRoomRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class RoomsService(
    IRoomRepository roomRepository,
    IValidator<CreateRoomRequest> createRoomValidator,
    IValidator<UpdateRoomRequest> updateRoomValidator) : IRoomsService
{
    public async Task<CreateRoomResponse> CreateAsync(CreateRoomRequest request, CancellationToken cancellationToken)
    {
        await createRoomValidator.ValidateAndThrowAsync(request, cancellationToken);

        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        await roomRepository.CreateAsync(room, cancellationToken);

        return new CreateRoomResponse(room.Id, room.Name, room.Capacity);
    }

    public async Task<List<GetRoomResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var rooms = await roomRepository.GetAllAsync(cancellationToken);

        return rooms.Select(room => new GetRoomResponse(
            room.Id,
            room.Name,
            room.Capacity)).ToList();
    }

    public async Task<GetRoomResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var room = await roomRepository.GetByIdAsync(id, cancellationToken);
        return room is null ? null : new GetRoomResponse(room.Id, room.Name, room.Capacity);
    }

    public async Task<UpdateRoomResponse?> UpdateAsync(Guid id, UpdateRoomRequest request, CancellationToken cancellationToken)
    {
        var requestWithId = request with { Id = id };
        await updateRoomValidator.ValidateAndThrowAsync(requestWithId, cancellationToken);

        var room = await roomRepository.GetByIdAsync(id, cancellationToken);

        if (room == null)
            return null;

        room.Name = requestWithId.Name.Trim();
        room.Capacity = requestWithId.Capacity;

        await roomRepository.UpdateAsync(room, cancellationToken);

        return new UpdateRoomResponse(room.Id, room.Name, room.Capacity);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await roomRepository.DeleteAsync(id, cancellationToken);
    }
}

