namespace Backend.Application.Features.Rooms.Responses;

public record UpdateRoomResponse(Guid Id, string Name, int Capacity);