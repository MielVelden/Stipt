using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, SessionQueryOptions? options)
    {
        options ??= new SessionQueryOptions { };

        var enrolledCount = session.Enrollments.Count(x => x.Status == SessionEnrollmentStatus.Enrolled);
        var waitlist = session.Enrollments
            .Where(x => x.Status == SessionEnrollmentStatus.Waitlisted)
            .OrderBy(x => x.CreatedAtUtc)
            .ThenBy(x => x.Id)
            .ToList();
        var waitlistCount = waitlist.Count;

        var effectiveCapacity = session.Capacity ?? session.Room.Capacity;
        var hasAvailableSpots = enrolledCount < effectiveCapacity;

        SessionEnrollmentStatus? myEnrollmentStatus = null;
        int? myWaitlistPosition = null;

        if (options.ParticipantId.HasValue)
        {
            var myEnrollment = session.Enrollments.FirstOrDefault(x => x.ParticipantId == options.ParticipantId.Value);
            myEnrollmentStatus = myEnrollment?.Status;
            if (myEnrollmentStatus == SessionEnrollmentStatus.Waitlisted)
            {
                var index = waitlist.FindIndex(x => x.ParticipantId == options.ParticipantId.Value);
                myWaitlistPosition = index >= 0 ? index + 1 : null;
            }
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
            enrolledCount,
            waitlistCount,
            hasAvailableSpots,
            myEnrollmentStatus,
            myWaitlistPosition
        );
    }
}


