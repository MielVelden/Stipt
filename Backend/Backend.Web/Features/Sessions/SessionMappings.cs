using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session)
    {
        return new SessionRo(
            session.Id,
            session.Title,
            session.Description,
            session.Speaker,
            session.Room,
            session.StartTime,
            session.EndTime,
            session.Capacity,
            session.Labels.AsReadOnly(),
            session.CreatedAtUtc,
            session.UpdatedAtUtc
        );
    }
}


