using System.Security.Claims;
using Backend.Web.Features.EventParticipants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Web.Configuration;

public sealed class EventParticipantAuthorizationFilter(EventParticipantsService eventParticipantsService)
    : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.IsInRole(AppRoles.Attendee))
            return;

        var email = user.FindFirstValue(ClaimTypes.Email);
        if (email is null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var eventIdRaw = context.RouteData.Values["eventId"]?.ToString();
        if (!Guid.TryParse(eventIdRaw, out var eventId))
        {
            context.Result = new BadRequestResult();
            return;
        }

        var isParticipant = await eventParticipantsService.IsParticipantAsync(
            eventId, email, context.HttpContext.RequestAborted);

        if (!isParticipant)
            context.Result = new ForbidResult();
    }
}
