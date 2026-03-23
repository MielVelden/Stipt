using Backend.Web.Features.Rooms.Responses;
using MediatR;

namespace Backend.Web.Features.Rooms.Requests;

public record GetRoomByIdRequest(Guid Id) : IRequest<GetRoomResponse?>;