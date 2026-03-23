namespace Backend.Web.Features.Rooms.Responses;

public record CreateRoomResponse(Guid Id, string Name, int Capacity);