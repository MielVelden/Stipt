using Backend.Database.Entities.Events;
using Backend.Web.Features.EventParticipants;
using Backend.Web.Features.Events.Dtos;

namespace Backend.Web.Features.Events;

public sealed class EventsService(IEventRepository eventRepository, EventParticipantsService eventParticipantsService)
{
    public async Task<EventRo> CreateAsync(CreateEventDto request, CancellationToken cancellationToken)
    {
        var eventItem = new Event
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Location = request.Location.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Style = new EventStyle
            {
                PrimaryBackgroundColor = request.Style.PrimaryBackgroundColor.Trim(),
                PrimaryForegroundColor = request.Style.PrimaryForegroundColor.Trim(),
                LogoImageUrl = request.Style.LogoImageUrl?.Trim()
            },
            IsArchived = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        await eventRepository.AddAsync(eventItem, cancellationToken);

        return eventItem.ToRo();
    }

    public async Task<EventRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);
        return eventItem?.ToRo();
    }

    public async Task<EventRo?> GetByIdForAttendeeAsync(Guid id, string userEmail, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);

        if (eventItem is null)
            return null;

        if (!await eventParticipantsService.IsParticipantAsync(id, userEmail, cancellationToken))
            return null;

        return eventItem.ToRo();
    }

    public async Task<List<EventRo>> GetAllAsync(bool includeArchived, CancellationToken cancellationToken)
    {
        var events = await eventRepository.GetAllAsync(includeArchived, cancellationToken);
        return events.Select(EventMappings.ToRo).ToList();
    }

    public async Task<List<EventRo>> GetAllForAttendeeAsync(string userEmail, bool includeArchived, CancellationToken cancellationToken)
    {
        var normalizedEmail = userEmail.Trim().ToLowerInvariant();
        var events = await eventRepository.GetAllForParticipantAsync(normalizedEmail, includeArchived, cancellationToken);
        return events.Select(EventMappings.ToRo).ToList();
    }

    public async Task<EventRo?> UpdateAsync(Guid id, UpdateEventDto request, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);
        if (eventItem is null)
            return null;

        eventItem.Name = request.Name.Trim();
        eventItem.Location = request.Location.Trim();
        eventItem.StartDate = request.StartDate;
        eventItem.EndDate = request.EndDate;
        eventItem.Style.PrimaryBackgroundColor = request.Style.PrimaryBackgroundColor.Trim();
        eventItem.Style.PrimaryForegroundColor = request.Style.PrimaryForegroundColor.Trim();
        eventItem.Style.LogoImageUrl = request.Style.LogoImageUrl?.Trim();
        eventItem.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await eventRepository.UpdateAsync(eventItem, cancellationToken);
        if (!updated)
            return null;

        return eventItem.ToRo();
    }

    public async Task<bool> ArchiveAsync(Guid id, CancellationToken cancellationToken)
    {
        return await SetArchivedStatusAsync(id, true, cancellationToken);
    }

    public async Task<bool> UnarchiveAsync(Guid id, CancellationToken cancellationToken)
    {
        return await SetArchivedStatusAsync(id, false, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await eventRepository.DeleteAsync(id, cancellationToken);
    }

    private async Task<bool> SetArchivedStatusAsync(Guid id, bool isArchived, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);
        if (eventItem is null)
            return false;

        eventItem.IsArchived = isArchived;
        eventItem.UpdatedAtUtc = DateTime.UtcNow;

        return await eventRepository.UpdateAsync(eventItem, cancellationToken);
    }
}

