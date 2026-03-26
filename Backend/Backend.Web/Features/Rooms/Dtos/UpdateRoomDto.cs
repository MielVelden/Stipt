namespace Backend.Web.Features.Rooms.Dtos;

public sealed record UpdateRoomDto(
    string Name,
    int Capacity);

