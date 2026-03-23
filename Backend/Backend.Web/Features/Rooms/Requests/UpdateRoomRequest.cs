using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Requests;

public record UpdateRoomRequest(Guid Id, string Name, int Capacity) : IRequest<UpdateRoomResponse>;