using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, Guid? participantId)
    {
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

        if (participantId.HasValue)
        {
            var myEnrollment = session.Enrollments.FirstOrDefault(x => x.ParticipantId == participantId.Value);
            myEnrollmentStatus = myEnrollment?.Status;
            if (myEnrollmentStatus == SessionEnrollmentStatus.Waitlisted)
            {
                var index = waitlist.FindIndex(x => x.ParticipantId == participantId.Value);
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

    public static ConflictingSessionRo ToConflictingSessionRo(this Session session)
    {
        return new ConflictingSessionRo(
            session.Id,
            session.Title,
            session.StartDateTime,
            session.EndDateTime,
            session.Room.Name);
    }
}
