namespace Backend.Web.Features.Rooms.Requests;

public record UpdateRoomRequest(Guid Id, string Name, int Capacity);
