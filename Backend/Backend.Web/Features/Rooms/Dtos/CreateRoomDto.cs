namespace Backend.Web.Features.Rooms.Dtos;

public sealed record CreateRoomDto(
    string Name,
    int Capacity);

