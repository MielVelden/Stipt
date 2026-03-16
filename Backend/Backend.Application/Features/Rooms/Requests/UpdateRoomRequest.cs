using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Requests;

public record UpdateRoomRequest(Guid Id, string Name, int Capacity) : IRequest<UpdateRoomResponse>;