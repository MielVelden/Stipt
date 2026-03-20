using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Requests;

public record GetAllRoomsRequest() : IRequest<List<GetRoomResponse>>;