using Backend.Web.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebApi(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseWebApi();
app.Run();
