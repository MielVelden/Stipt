using Backend.Database.Entities.EventParticipants;
using Backend.Web.Features.EventParticipants.Dtos;

namespace Backend.Web.Features.EventParticipants;

public sealed class EventParticipantsService(IEventParticipantRepository eventParticipantRepository)
{
    public async Task<EventParticipantRo> CreateAsync(Guid eventId, CreateEventParticipantDto request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var exists = await eventParticipantRepository.ExistsAsync(eventId, normalizedEmail, cancellationToken);
        if (exists)
            throw new InvalidOperationException($"A participant with email '{normalizedEmail}' is already registered for this event.");

        var participant = new EventParticipant
        {
            EventId = eventId,
            Email = normalizedEmail,
            CreatedAtUtc = DateTime.UtcNow
        };

        await eventParticipantRepository.AddAsync(participant, cancellationToken);

        return participant.ToRo();
    }

    public async Task<EventParticipantRo?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var participant = await eventParticipantRepository.GetByEventIdAndEmailAsync(eventId, normalizedEmail, cancellationToken);

        if (participant is null)
            return null;

        return participant.ToRo();
    }

    public async Task<List<EventParticipantRo>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var participants = await eventParticipantRepository.GetAllByEventIdAsync(eventId, cancellationToken);

        return participants.Select(EventParticipantMappings.ToRo).ToList();
    }

    public async Task<List<EventParticipantRo>> GetEventsByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var participants = await eventParticipantRepository.GetAllByEmailAsync(normalizedEmail, cancellationToken);

        return participants.Select(EventParticipantMappings.ToRo).ToList();
    }

    public async Task<bool> DeleteAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await eventParticipantRepository.DeleteAsync(eventId, normalizedEmail, cancellationToken);
    }
}
