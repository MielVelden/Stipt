using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, SessionQueryOptions? options)
    {
        options ??= new SessionQueryOptions { };

        // Replace mock count with real registration count
        var registrationCount = options.IncludeRegistrationCount ? (int?)0 : null;

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
            registrationCount
        );
    }
}


