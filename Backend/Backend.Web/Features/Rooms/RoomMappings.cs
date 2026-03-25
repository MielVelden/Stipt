using Backend.Database.Entities.Rooms;
using Backend.Web.Features.Rooms.Dtos;

namespace Backend.Web.Features.Rooms;

public static class RoomMappings
{
    public static RoomRo ToRo(this Room room)
    {
        return new RoomRo(room.Id, room.Name, room.Capacity, room.EventId);
    }
}


