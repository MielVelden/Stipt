using Backend.Database;
using Backend.Database.Entities;
using Backend.Database.Persistence;
using Backend.Web.Configuration;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebApi(builder.Configuration);

builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

app.MapIdentityApi<ApplicationUser>();

await app.Services.MigrateAndSeedDatabaseAsync();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseWebApi();
app.Run();
