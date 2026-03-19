using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using Backend.Common.Application;
using Backend.Domain.Sessions;
using MediatR;
using NodaTime;

namespace Backend.Application.Features.Sessions.Handlers;

public sealed class UpdateSessionHandler(ISessionRepository sessionRepository, IClock clock)
    : IRequestHandler<UpdateSessionRequest, UpdateSessionResponse?>
{
    public async Task<UpdateSessionResponse?> Handle(UpdateSessionRequest request, CancellationToken cancellationToken)
    {
        var existingSession = await sessionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existingSession is null)
            return null;

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            request.Id,
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
        existingSession.Tags = request.Tags?.Select(tag => tag.Trim()).ToList() ?? [];
        existingSession.IsArchived = request.IsArchived;
        existingSession.UpdatedAtUtc = clock.GetCurrentInstant();

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
            existingSession.Tags.AsReadOnly(),
            existingSession.IsArchived,
            existingSession.CreatedAtUtc,
            existingSession.UpdatedAtUtc.Value);
    }
}
