using Backend.Application.Features.Rooms.Repositories;
using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Handlers;

public sealed class GetAllRoomsHandler(IRoomRepository roomRepository) : IRequestHandler<GetAllRoomsRequest, List<GetRoomResponse>>
{
	public async Task<List<GetRoomResponse>> Handle(GetAllRoomsRequest request, CancellationToken ct)
	{
		var rooms = await roomRepository.GetAllAsync(ct);

		return rooms.Select(room => new GetRoomResponse(
			room.Id,
			room.Name,
			room.Capacity))
			.ToList();
	}
}