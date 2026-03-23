namespace Backend.Web.Features.Rooms.Responses;

public record GetRoomResponse(Guid Id, string Name, int Capacity);