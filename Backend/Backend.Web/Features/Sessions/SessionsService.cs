using Backend.Common.Application;
using Backend.Domain.Sessions;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Repositories;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Services;

public interface ISessionsService
{
    Task<SessionRo> CreateAsync(CreateSessionDto request, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<SessionRo>> GetAllAsync(CancellationToken cancellationToken);
    Task<SessionRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<SessionRo?> UpdateAsync(Guid id, UpdateSessionDto request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class SessionsService(
    ISessionRepository sessionRepository,
    IValidator<CreateSessionDto> createSessionValidator,
    IValidator<UpdateSessionDto> updateSessionValidator) : ISessionsService
{
    public async Task<SessionRo> CreateAsync(CreateSessionDto request, CancellationToken cancellationToken)
    {
        await createSessionValidator.ValidateAndThrowAsync(request, cancellationToken);

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            excludedSessionId: null,
            cancellationToken);

        if (hasOverlap)
            throw new ConflictException("The requested time slot overlaps with another session in the same room.");

        var session = new Session
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Speaker = request.Speaker.Trim(),
            Room = request.Room.Trim(),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Capacity = request.Capacity,
            Labels = request.Labels?.Select(label => label.Trim()).ToList() ?? [],
            CreatedAtUtc = DateTime.UtcNow
        };

        await sessionRepository.AddAsync(session, cancellationToken);

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
            session.UpdatedAtUtc);
    }

    public async Task<IReadOnlyCollection<SessionRo>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(cancellationToken);
        return sessions
            .Select(session => new SessionRo(
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
                session.UpdatedAtUtc))
            .ToArray();
    }

    public async Task<SessionRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(id, cancellationToken);
        return session is null
            ? null
            : new SessionRo(
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
                session.UpdatedAtUtc);
    }

    public async Task<SessionRo?> UpdateAsync(Guid id, UpdateSessionDto request, CancellationToken cancellationToken)
    {
        await updateSessionValidator.ValidateAndThrowAsync(request, cancellationToken);

        var existingSession = await sessionRepository.GetByIdAsync(id, cancellationToken);
        if (existingSession is null)
            return null;

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            id,
            cancellationToken);

        if (hasOverlap)
            throw new ConflictException("The requested time slot overlaps with another session in the same room.");

        existingSession.Title = request.Title.Trim();
        existingSession.Description = request.Description?.Trim();
        existingSession.Speaker = request.Speaker.Trim();
        existingSession.Room = request.Room.Trim();
        existingSession.StartTime = request.StartTime;
        existingSession.EndTime = request.EndTime;
        existingSession.Capacity = request.Capacity;
        existingSession.Labels = request.Labels?.Select(label => label.Trim()).ToList() ?? [];
        existingSession.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await sessionRepository.UpdateAsync(existingSession, cancellationToken);
        if (!updated)
            return null;

        return new SessionRo(
            existingSession.Id,
            existingSession.Title,
            existingSession.Description,
            existingSession.Speaker,
            existingSession.Room,
            existingSession.StartTime,
            existingSession.EndTime,
            existingSession.Capacity,
            existingSession.Labels.AsReadOnly(),
            existingSession.CreatedAtUtc,
            existingSession.UpdatedAtUtc);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await sessionRepository.DeleteAsync(id, cancellationToken);
    }
}

