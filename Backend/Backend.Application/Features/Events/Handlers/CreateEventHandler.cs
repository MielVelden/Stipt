using Backend.Application.Features.Events.Repositories;
using Backend.Application.Features.Events.Requests;
using Backend.Application.Features.Events.Responses;
using Backend.Domain.Events;
using MediatR;

namespace Backend.Application.Features.Events.Handlers;

public sealed class CreateEventHandler(IEventRepository eventRepository) 
    : IRequestHandler<CreateEventRequest, CreateEventResponse>
{
    public async Task<CreateEventResponse> Handle(CreateEventRequest request, CancellationToken cancellationToken)
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
            eventItem.CreatedAtUtc
        );
    }
}
