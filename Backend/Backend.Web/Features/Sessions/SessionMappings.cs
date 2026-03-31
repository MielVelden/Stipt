using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Enums;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, int currentAttendeeCount = 0)
    {
        int maxCapacity = session.Capacity ?? session.Room.Capacity;

        var availability = CalculateAvailability(currentAttendeeCount, maxCapacity);

        return new SessionRo(
            session.Id,
            session.Title,
            session.Description,
            session.Type,
            session.Speaker,
            session.RoomId,
            new SessionRoomRo(
                session.Room.Id,
                session.Room.Name,
                session.Room.Capacity),
            session.EventId,
            session.StartDateTime,
            session.EndDateTime,
            session.Capacity,
            session.Labels.AsReadOnly(),
            session.CreatedAtUtc,
            session.UpdatedAtUtc,
            availability,
            currentAttendeeCount
        );
    }

    private static SessionAvailability CalculateAvailability(int currentAttendees, int maxCapacity)
    {
        if (maxCapacity <= 0) return SessionAvailability.Full;

        if (currentAttendees >= maxCapacity)
            return SessionAvailability.Full;

        double occupancyRate = (double)currentAttendees / maxCapacity;

        if (occupancyRate >= 0.80)
            return SessionAvailability.FillingUp;

        return SessionAvailability.Available;
    }
}




