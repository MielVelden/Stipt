using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, SessionQueryOptions? options)
    {
        options ??= new SessionQueryOptions { };

        // Replace mock count with real registration count
        var registrationCount = options.IncludeRegistrationCount
                ? (int?)Random.Shared.Next(1, 100)
                : null;

        string availability = "Available";
        if (registrationCount.HasValue && session.Capacity.HasValue)
        {
            if (registrationCount >= session.Capacity) availability = "Full";
            else if (registrationCount >= session.Capacity * 0.8) availability = "FillingUp";
        }

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
            registrationCount,
            availability
        );
    }
}


