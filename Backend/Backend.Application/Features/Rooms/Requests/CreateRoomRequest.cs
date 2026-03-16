using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Requests;

public record CreateRoomRequest(string Name, int Capacity) : IRequest<CreateRoomResponse>;