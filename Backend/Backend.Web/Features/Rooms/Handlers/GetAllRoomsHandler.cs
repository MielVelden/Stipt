using Backend.Web.Features.Rooms.Repositories;
using Backend.Web.Features.Rooms.Requests;
using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Handlers;

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