using Backend.Application.Features.Rooms.Responses;
using MediatR;

namespace Backend.Application.Features.Rooms.Requests;

public record GetRoomByIdRequest(Guid Id) : IRequest<GetRoomResponse?>;