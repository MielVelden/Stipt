using Backend.Web.Features.Events.Repositories;
using Backend.Web.Features.Events.Requests;
using Backend.Web.Features.Events.Responses;
using MediatR;

namespace Backend.Web.Features.Events.Handlers;

public sealed class GetAllEventsHandler(IEventRepository eventRepository) 
    : IRequestHandler<GetAllEventsRequest, List<GetAllEventsResponse>>
{
    public async Task<List<GetAllEventsResponse>> Handle(GetAllEventsRequest request, CancellationToken cancellationToken)
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
}
