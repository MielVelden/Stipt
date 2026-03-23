using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Database;

public static class DependencyInjection
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'ConnectionStrings:Default' was not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString, npgsql =>
                npgsql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<ISessionRepository, SessionRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IRoomRepository, RoomRepository>();

        return services;
    }
}
