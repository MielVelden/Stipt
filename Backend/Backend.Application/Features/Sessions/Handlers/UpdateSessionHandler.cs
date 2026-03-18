using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using Backend.Common.Application;
using Backend.Domain.Sessions;
using MediatR;

namespace Backend.Application.Features.Sessions.Handlers;

public sealed class UpdateSessionHandler(ISessionRepository sessionRepository)
    : IRequestHandler<UpdateSessionRequest, UpdateSessionResponse?>
{
    public async Task<UpdateSessionResponse?> Handle(UpdateSessionRequest request, CancellationToken cancellationToken)
    {
        var existingSession = await sessionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existingSession is null)
        {
            return null;
        }

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            request.Id,
            cancellationToken);

        if (hasOverlap)
        {
            throw new ConflictException("The requested time slot overlaps with another session in the same room.");
        }

        var updatedSession = new Session
        {
            Id = request.Id,
            Title = request.Title?.Trim() ?? string.Empty,
            Description = request.Description?.Trim() ?? string.Empty,
            Speaker = request.Speaker?.Trim() ?? string.Empty,
            Room = request.Room?.Trim() ?? string.Empty,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Capacity = request.Capacity,
            Tags = request.Tags?.Select(tag => tag.Trim()).ToList() ?? []
        };

        await sessionRepository.UpdateAsync(updatedSession, cancellationToken);

        return new UpdateSessionResponse(
            updatedSession.Id,
            updatedSession.Title,
            updatedSession.Description,
            updatedSession.Speaker,
            updatedSession.Room,
            updatedSession.StartTime,
            updatedSession.EndTime,
            updatedSession.Capacity,
            updatedSession.Tags.AsReadOnly());
    }
}
