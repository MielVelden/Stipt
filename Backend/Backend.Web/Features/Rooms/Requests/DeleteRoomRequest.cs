using MediatR;

namespace Backend.Web.Features.Rooms.Requests;

public record DeleteRoomRequest(Guid Id) : IRequest<Unit>;