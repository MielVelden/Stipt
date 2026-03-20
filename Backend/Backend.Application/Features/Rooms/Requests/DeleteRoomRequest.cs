using MediatR;

namespace Backend.Application.Features.Rooms.Requests;

public record DeleteRoomRequest(Guid Id) : IRequest<Unit>;