using Backend.Domain.Events;
using Backend.Web.Features.Events.Dtos;

namespace Backend.Web.Features.Events;

public static class EventMappings
{
    public static EventRo ToRo(this Event eventItem)
    {
        return new EventRo(
            eventItem.Id,
            eventItem.Name,
            eventItem.Location,
            eventItem.StartDate,
            eventItem.EndDate,
            eventItem.Style.ToRo(),
            eventItem.IsArchived,
            eventItem.CreatedAtUtc,
            eventItem.UpdatedAtUtc
        );
    }

    private static EventStyleRo ToRo(this EventStyle style)
    {
        return new EventStyleRo(
            style.PrimaryBackgroundColor,
            style.PrimaryForegroundColor,
            style.LogoImageUrl
        );
    }
}

