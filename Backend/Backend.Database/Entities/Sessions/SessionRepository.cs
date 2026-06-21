using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.SessionsAttendances;
using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Backend.Database.Entities.Sessions;

internal sealed class SessionRepository(ApplicationDbContext dbContext) : ISessionRepository
{
    public async Task AddAsync(Session session, CancellationToken cancellationToken)
    {
        await dbContext.Sessions.AddAsync(session, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Session?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Include(x => x.Speakers)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);
    }

    public Task<Session?> GetTrackedWithSpeakersAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Sessions
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Include(x => x.Speakers)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetFilteredAsync(Guid eventId, SessionFilter filter, CancellationToken cancellationToken)
    {
        var query = dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Include(x => x.Speakers)
            .Where(x => x.EventId == eventId);

        if (filter.Labels is { Count: > 0 })
            query = query.Where(s => s.Labels.Any(label => filter.Labels.Contains(label)));

        if (filter.AvailableOnly == true)
            query = query.Where(s => s.Enrollments.Count(e => e.Status == SessionEnrollmentStatus.Enrolled) < (s.Capacity ?? int.MaxValue));


        return await query
            .OrderBy(x => x.StartDateTime)
            .ThenBy(x => x.Room.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetAgendaSessionsAsync(
        Guid eventId,
        Guid participantId,
        SessionFilter filter,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments.Where(e => e.ParticipantId == participantId))
            .Include(x => x.Speakers)
            .Where(s => s.EventId == eventId)
            .Where(s => s.Enrollments.Any(e => e.ParticipantId == participantId && e.Status == SessionEnrollmentStatus.Enrolled)
            );

        if (filter.Labels is { Count: > 0 })
            query = query.Where(s => s.Labels.Any(label => filter.Labels.Contains(label)));

        if (filter.AvailableOnly == true)
            query = query.Where(s => s.Enrollments.Count(e => e.Status == SessionEnrollmentStatus.Enrolled) < (s.Capacity ?? int.MaxValue));

        return await query
            .OrderBy(s => s.StartDateTime)
            .ToListAsync(cancellationToken);
    }


    public async Task<IReadOnlyCollection<Session>> GetWithAttendanceAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Enrollments)
            .Include(x => x.Attendances)
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public Task<Session?> GetWithAttendanceDetailAsync(Guid eventId, Guid sessionId, CancellationToken cancellationToken)
    {
        return dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Include(x => x.Attendances)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == sessionId, cancellationToken);
    }

    public async Task UpsertAttendanceAsync(Guid sessionId, Guid participantId, SessionAttendanceStatus status, CancellationToken cancellationToken)
    {
        var existing = await dbContext.SessionAttendances
            .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.ParticipantId == participantId, cancellationToken);

        if (existing is null)
        {
            await dbContext.SessionAttendances.AddAsync(new SessionAttendance
            {
                Id = Guid.NewGuid(),
                SessionId = sessionId,
                ParticipantId = participantId,
                Status = status,
                CreatedAtUtc = DateTime.UtcNow
            }, cancellationToken);
        }
        else
        {
            existing.Status = status;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task MarkUnknownAsAbsentAsync(Guid sessionId, IReadOnlyList<Guid> enrolledParticipantIds, CancellationToken cancellationToken)
    {
        var existingRecords = await dbContext.SessionAttendances
            .Where(a => a.SessionId == sessionId && enrolledParticipantIds.Contains(a.ParticipantId))
            .ToListAsync(cancellationToken);

        foreach (var record in existingRecords.Where(r => r.Status == SessionAttendanceStatus.Unknown))
        {
            record.Status = SessionAttendanceStatus.Absent;
            record.UpdatedAtUtc = DateTime.UtcNow;
        }

        var existingIds = existingRecords.Select(r => r.ParticipantId).ToHashSet();
        var newAbsent = enrolledParticipantIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new SessionAttendance
            {
                Id = Guid.NewGuid(),
                SessionId = sessionId,
                ParticipantId = id,
                Status = SessionAttendanceStatus.Absent,
                CreatedAtUtc = DateTime.UtcNow
            });

        await dbContext.SessionAttendances.AddRangeAsync(newAbsent, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken)
    {
        dbContext.Sessions.Update(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);

        if (session is null)
            return false;

        dbContext.Sessions.Remove(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> HasOverlapAsync(
        Guid eventId,
        Guid roomId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .AnyAsync(
                s => (!excludedSessionId.HasValue || s.Id != excludedSessionId.Value)
                     && s.EventId == eventId
                     && s.RoomId == roomId
                     && s.StartDateTime < endDateTime
                     && s.EndDateTime > startDateTime,
                cancellationToken);
    }

}
