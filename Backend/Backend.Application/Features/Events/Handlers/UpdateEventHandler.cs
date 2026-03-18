using Backend.Application.Features.Events.Repositories;
using Backend.Application.Features.Events.Requests;
using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Handlers;

public sealed class UpdateEventHandler(IEventRepository eventRepository) 
    : IRequestHandler<UpdateEventRequest, UpdateEventResponse?>
{
    public async Task<UpdateEventResponse?> Handle(UpdateEventRequest request, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(request.Id, cancellationToken);

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
            eventItem.CreatedAtUtc,
            eventItem.UpdatedAtUtc.Value
        );
    }
}
