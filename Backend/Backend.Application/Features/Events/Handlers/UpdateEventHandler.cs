using Backend.Application.Features.Events.Repositories;
using Backend.Application.Features.Events.Requests;
using Backend.Application.Features.Events.Responses;
using MediatR;

namespace Backend.Application.Features.Events.Handlers;

public sealed class UpdateEventHandler(IEventRepository eventRepository) : IRequestHandler<UpdateEventCommand, UpdateEventResponse?>
{
    public async Task<UpdateEventResponse?> Handle(UpdateEventCommand command, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(command.Id, cancellationToken);
        if (eventItem is null) return null;

        var request = command.Request;

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
        if (!updated) return null;

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
}
