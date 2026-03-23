using Backend.Domain.Events;
using Backend.Web.Features.Events.Repositories;
using Backend.Web.Features.Events.Requests;
using Backend.Web.Features.Events.Responses;

namespace Backend.Web.Features.Events.Services;

public interface IEventsService
{
    Task<CreateEventResponse> CreateAsync(CreateEventRequest request, CancellationToken cancellationToken);
    Task<GetEventByIdResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<GetAllEventsResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<UpdateEventResponse?> UpdateAsync(Guid id, UpdateEventRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed class EventsService(IEventRepository eventRepository) : IEventsService
{
    public async Task<CreateEventResponse> CreateAsync(CreateEventRequest request, CancellationToken cancellationToken)
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

        return new CreateEventResponse(
            eventItem.Id,
            eventItem.Name,
            eventItem.Location,
            eventItem.StartDate,
            eventItem.EndDate,
            new EventStyleDto(
                eventItem.Style.PrimaryBackgroundColor,
                eventItem.Style.PrimaryForegroundColor,
                eventItem.Style.LogoImageUrl
            ),
            eventItem.IsArchived,
            eventItem.CreatedAtUtc
        );
    }

    public async Task<GetEventByIdResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(id, cancellationToken);

        if (eventItem is null)
            return null;

        return new GetEventByIdResponse(
            eventItem.Id,
            eventItem.Name,
            eventItem.Location,
            eventItem.StartDate,
            eventItem.EndDate,
            new EventStyleDto(
                eventItem.Style.PrimaryBackgroundColor,
                eventItem.Style.PrimaryForegroundColor,
                eventItem.Style.LogoImageUrl
            ),
            eventItem.IsArchived,
            eventItem.CreatedAtUtc,
            eventItem.UpdatedAtUtc
        );
    }

    public async Task<List<GetAllEventsResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var events = await eventRepository.GetAllAsync(cancellationToken);

        return events.Select(e => new GetAllEventsResponse(
            e.Id,
            e.Name,
            e.Location,
            e.StartDate,
            e.EndDate,
            new EventStyleDto(
                e.Style.PrimaryBackgroundColor,
                e.Style.PrimaryForegroundColor,
                e.Style.LogoImageUrl
            ),
            e.IsArchived,
            e.CreatedAtUtc,
            e.UpdatedAtUtc
        )).ToList();
    }

    public async Task<UpdateEventResponse?> UpdateAsync(Guid id, UpdateEventRequest request, CancellationToken cancellationToken)
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

        return new UpdateEventResponse(
            eventItem.Id,
            eventItem.Name,
            eventItem.Location,
            eventItem.StartDate,
            eventItem.EndDate,
            new EventStyleDto(
                eventItem.Style.PrimaryBackgroundColor,
                eventItem.Style.PrimaryForegroundColor,
                eventItem.Style.LogoImageUrl
            ),
            eventItem.IsArchived,
            eventItem.CreatedAtUtc,
            eventItem.UpdatedAtUtc!.Value
        );
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await eventRepository.DeleteAsync(id, cancellationToken);
    }
}

