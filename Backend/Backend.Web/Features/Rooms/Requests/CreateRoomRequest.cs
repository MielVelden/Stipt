using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Requests;

public record CreateRoomRequest(string Name, int Capacity) : IRequest<CreateRoomResponse>;