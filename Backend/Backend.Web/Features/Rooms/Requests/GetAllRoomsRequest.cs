using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Requests;

public record GetAllRoomsRequest() : IRequest<List<GetRoomResponse>>;