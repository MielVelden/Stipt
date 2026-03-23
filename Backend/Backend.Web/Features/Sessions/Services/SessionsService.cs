using Backend.Common.Application;
using Backend.Domain.Sessions;
using Backend.Web.Features.Sessions.Repositories;
using Backend.Web.Features.Sessions.Requests;
using Backend.Web.Features.Sessions.Responses;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Services;

public interface ISessionsService
{
    Task<CreateSessionResponse> CreateAsync(CreateSessionRequest request, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<GetAllSessionsResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<GetSessionByIdResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<UpdateSessionResponse?> UpdateAsync(Guid id, UpdateSessionRequest request, CancellationToken cancellationToken);
    Task<DeleteSessionResponse?> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class SessionsService(
    ISessionRepository sessionRepository,
    IValidator<CreateSessionRequest> createSessionValidator,
    IValidator<UpdateSessionRequest> updateSessionValidator) : ISessionsService
{
    public async Task<CreateSessionResponse> CreateAsync(CreateSessionRequest request, CancellationToken cancellationToken)
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

        return new CreateSessionResponse(
            session.Id,
            session.Title,
            session.Description,
            session.Speaker,
            session.Room,
            session.StartTime,
            session.EndTime,
            session.Capacity,
            session.Labels.AsReadOnly(),
            session.CreatedAtUtc);
    }

    public async Task<IReadOnlyCollection<GetAllSessionsResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(cancellationToken);
        return sessions
            .Select(session => new GetAllSessionsResponse(
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

    public async Task<GetSessionByIdResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(id, cancellationToken);
        return session is null
            ? null
            : new GetSessionByIdResponse(
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

    public async Task<UpdateSessionResponse?> UpdateAsync(Guid id, UpdateSessionRequest request, CancellationToken cancellationToken)
    {
        var requestWithId = request with { Id = id };
        await updateSessionValidator.ValidateAndThrowAsync(requestWithId, cancellationToken);

        var existingSession = await sessionRepository.GetByIdAsync(id, cancellationToken);
        if (existingSession is null)
            return null;

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            requestWithId.Room,
            requestWithId.StartTime,
            requestWithId.EndTime,
            id,
            cancellationToken);

        if (hasOverlap)
            throw new ConflictException("The requested time slot overlaps with another session in the same room.");

        existingSession.Title = requestWithId.Title.Trim();
        existingSession.Description = requestWithId.Description?.Trim();
        existingSession.Speaker = requestWithId.Speaker.Trim();
        existingSession.Room = requestWithId.Room.Trim();
        existingSession.StartTime = requestWithId.StartTime;
        existingSession.EndTime = requestWithId.EndTime;
        existingSession.Capacity = requestWithId.Capacity;
        existingSession.Labels = requestWithId.Labels?.Select(label => label.Trim()).ToList() ?? [];
        existingSession.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await sessionRepository.UpdateAsync(existingSession, cancellationToken);
        if (!updated)
            return null;

        return new UpdateSessionResponse(
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
            existingSession.UpdatedAtUtc.Value);
    }

    public async Task<DeleteSessionResponse?> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await sessionRepository.DeleteAsync(id, cancellationToken);
        return deleted ? new DeleteSessionResponse(id) : null;
    }
}

