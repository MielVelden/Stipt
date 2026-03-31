using Microsoft.AspNetCore.SignalR;

namespace Backend.Web.Features.Sessions;

public class SessionsHub : Hub
{
    public async Task SendMessage(string msg)
    {
        await Clients.All.SendAsync("ReceiveMessage", msg);
    }
}