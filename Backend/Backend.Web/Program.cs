using System.Text;
using Backend.Database;
using Backend.Database.Entities;
using Backend.Database.Persistence;
using Backend.Web.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebApi(builder.Configuration);
builder.Services.AddSignalR();

builder.Services
    .AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var secretKey = builder.Configuration["Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("Jwt:SecretKey is not configured. Set it via user-secrets or environment variables.");

        options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:Issuer"];
        options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:Audience"];
        options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/api/hub/"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

await app.Services.MigrateAndSeedDatabaseAsync();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseWebApi();
app.UseAuthentication();
app.UseAuthorization();
app.AddHubs();
app.MapControllers();
app.Run();
