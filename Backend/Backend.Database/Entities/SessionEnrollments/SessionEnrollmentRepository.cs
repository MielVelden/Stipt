using Backend.Database.Persistence;
using Backend.Database.Entities.Sessions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.SessionEnrollments;

internal sealed class SessionEnrollmentRepository(ApplicationDbContext dbContext) : ISessionEnrollmentRepository
{
    public Task<SessionEnrollment?> GetEnrollmentAsync(Guid sessionId, Guid participantId, CancellationToken cancellationToken)
    {
        return dbContext.SessionEnrollments
            .FirstOrDefaultAsync(
                x => x.SessionId == sessionId && x.ParticipantId == participantId,
                cancellationToken);
    }

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
        DateTime startDateTime,
        DateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Where(
                x => x.EventId == eventId
                     && (!excludedSessionId.HasValue || x.Id != excludedSessionId.Value)
                     && x.StartDateTime < endDateTime
                     && x.EndDateTime > startDateTime
                     && x.Enrollments.Any(e =>
                         e.ParticipantId == participantId
                         && e.Status == SessionEnrollmentStatus.Enrolled))
            .OrderBy(x => x.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetAgendaAsync(Guid eventId, Guid participantId, CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Where(x => x.EventId == eventId)
            .Where(x => x.Enrollments.Any(e => e.ParticipantId == participantId && e.Status == SessionEnrollmentStatus.Enrolled))
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



