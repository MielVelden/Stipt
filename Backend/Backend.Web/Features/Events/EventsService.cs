using Backend.Domain.Events;
using Backend.Web.Features.Events.Dtos;
using Backend.Web.Features.Events.Repositories;

namespace Backend.Web.Features.Events;

public sealed class EventsService(IEventRepository eventRepository)
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

        if (eventItem is null)
            return null;

        return eventItem.ToRo();
    }

    public async Task<List<EventRo>> GetAllAsync(CancellationToken cancellationToken)
    {
        var events = await eventRepository.GetAllAsync(cancellationToken);

        return events.Select(EventMappings.ToRo).ToList();
    }

    public async Task<EventRo?> UpdateAsync(Guid id, UpdateEventDto request, CancellationToken cancellationToken)
    {

        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);
        if (eventItem is null)
            return null;

        request.Name.IfPresent(value => eventItem.Name = value.Trim());
        request.Location.IfPresent(value => eventItem.Location = value.Trim());
        request.IsArchived.IfPresent(value => eventItem.IsArchived = value);
        request.StartDate.IfPresent(value => eventItem.StartDate = value);
        request.EndDate.IfPresent(value => eventItem.EndDate = value);

        request.Style.IfPresent(value =>
        {
            value.PrimaryBackgroundColor.IfPresent(bg => eventItem.Style.PrimaryBackgroundColor = bg.Trim());
            value.PrimaryForegroundColor.IfPresent(fg => eventItem.Style.PrimaryForegroundColor = fg.Trim());
            value.LogoImageUrl.IfPresent(img => eventItem.Style.LogoImageUrl = img?.Trim());
        });
        eventItem.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await eventRepository.UpdateAsync(eventItem, cancellationToken);
        if (!updated)
            return null;

        return eventItem.ToRo();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await eventRepository.DeleteAsync(id, cancellationToken);
    }
}

