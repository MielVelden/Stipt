using Backend.Web.Configuration;
using Backend.Web.Features.Sessions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebApi(builder.Configuration);
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapHub<SessionsHub>("/api/sessionshub");
app.UseWebApi();
app.Run();
