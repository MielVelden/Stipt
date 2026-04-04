using Backend.Database.Persistence;
using Backend.Database.Entities.Sessions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.SessionEnrollments;

internal sealed class SessionEnrollmentRepository(ApplicationDbContext dbContext) : ISessionEnrollmentRepository
{
    public async Task AddEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken)
    {
        await dbContext.SessionEnrollments.AddAsync(enrollment, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken)
    {
        dbContext.SessionEnrollments.Update(enrollment);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken)
    {
        dbContext.SessionEnrollments.Remove(enrollment);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<SessionEnrollment?> GetFirstWaitlistedEnrollmentAsync(Guid sessionId, CancellationToken cancellationToken)
    {
        return dbContext.SessionEnrollments
            .Where(x => x.SessionId == sessionId && x.Status == SessionEnrollmentStatus.Waitlisted)
            .OrderBy(x => x.CreatedAtUtc)
            .ThenBy(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetOverlappingEnrolledSessionsAsync(
        Guid eventId,
        Guid participantId,
        Guid excludedSessionId,
        CancellationToken cancellationToken)
    {
        var excludedSessionTimeSlot = await dbContext.Sessions
            .AsNoTracking()
            .Where(x => x.EventId == eventId && x.Id == excludedSessionId)
            .Select(x => new { x.StartDateTime, x.EndDateTime })
            .FirstOrDefaultAsync(cancellationToken);

        if (excludedSessionTimeSlot is null)
            return [];

        return await dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Where(
                x => x.EventId == eventId
                     && x.Id != excludedSessionId
                     && x.StartDateTime < excludedSessionTimeSlot.EndDateTime
                     && x.EndDateTime > excludedSessionTimeSlot.StartDateTime
                     && x.Enrollments.Any(e =>
                         e.ParticipantId == participantId
                         && e.Status == SessionEnrollmentStatus.Enrolled))
            .OrderBy(x => x.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<int?> GetWaitlistPositionAsync(Guid sessionId, Guid participantId, CancellationToken cancellationToken)
    {
        var waitlistOrder = await dbContext.SessionEnrollments
            .AsNoTracking()
            .Where(x => x.SessionId == sessionId && x.Status == SessionEnrollmentStatus.Waitlisted)
            .OrderBy(x => x.CreatedAtUtc)
            .ThenBy(x => x.Id)
            .Select(x => x.ParticipantId)
            .ToListAsync(cancellationToken);

        var index = waitlistOrder.FindIndex(id => id == participantId);
        return index >= 0 ? index + 1 : null;
    }
}
