using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using Backend.Common.Application;
using Backend.Domain.Sessions;
using MediatR;

namespace Backend.Application.Features.Sessions.Handlers;

public sealed class CreateSessionHandler(ISessionRepository sessionRepository)
    : IRequestHandler<CreateSessionRequest, CreateSessionResponse>
{
    public async Task<CreateSessionResponse> Handle(CreateSessionRequest request, CancellationToken cancellationToken)
    {
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
            Tags = request.Tags?.Select(tag => tag.Trim()).ToList() ?? [],
            IsArchived = false,
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
            session.Tags.AsReadOnly(),
            session.IsArchived,
            session.CreatedAtUtc);
    }
}
