using Backend.Web.Features.Events.Repositories;
using Backend.Web.Features.Events.Requests;
using Backend.Web.Features.Events.Responses;
using MediatR;

namespace Backend.Web.Features.Events.Handlers;

public sealed class GetEventByIdHandler(IEventRepository eventRepository) 
    : IRequestHandler<GetEventByIdRequest, GetEventByIdResponse?>
{
    public async Task<GetEventByIdResponse?> Handle(GetEventByIdRequest request, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(request.Id, cancellationToken);

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
}
