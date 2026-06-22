using Microsoft.AspNetCore.SignalR;

namespace Backend.Web.Features.Sessions;

public sealed class SessionsHub : Hub
{
    public Task JoinEventGroup(string eventId) =>
        Groups.AddToGroupAsync(Context.ConnectionId, $"event-{eventId}");

    public Task LeaveEventGroup(string eventId) =>
        Groups.RemoveFromGroupAsync(Context.ConnectionId, $"event-{eventId}");
}
