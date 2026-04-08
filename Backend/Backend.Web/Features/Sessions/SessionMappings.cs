using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Enums;

namespace Backend.Web.Features.Sessions;

public static class SessionMappings
{
    public static SessionRo ToRo(this Session session, Guid? participantId = null)
    {
        var effectiveCapacity = session.Capacity ?? session.Room.Capacity;

        var enrolledCount = session.Enrollments.Count(x => x.Status == SessionEnrollmentStatus.Enrolled);

        var availability = CalculateAvailability(enrolledCount, effectiveCapacity);

        var waitlist = session.Enrollments
            .Where(x => x.Status == SessionEnrollmentStatus.Waitlisted)
            .OrderBy(x => x.CreatedAtUtc)
            .ThenBy(x => x.Id)
            .ToList();
        var waitlistCount = waitlist.Count;

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
            availability,
            enrolledCount,
            waitlistCount,
            hasAvailableSpots,
            myEnrollmentStatus,
            myWaitlistPosition
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
