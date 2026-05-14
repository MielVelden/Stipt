using Backend.Database.Entities.Events;
using System.Runtime.CompilerServices;
using Backend.Database.Entities;
using Backend.Database.Entities.Auth;
using Backend.Database.Entities.EventParticipants;
using Backend.Database.Entities.Notifications;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.Images;
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
            {
                npgsql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                npgsql.UseNodaTime();
            }));

        services.AddScoped<ISessionRepository, SessionRepository>();
        services.AddScoped<ISessionEnrollmentRepository, SessionEnrollmentRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IEventParticipantRepository, EventParticipantRepository>();
        services.AddScoped<IRoomRepository, RoomRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IUserNotificationRepository, UserNotificationRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IImageRepository, ImageRepository>();

        return services;
    }

    public static async Task MigrateAndSeedDatabaseAsync(this IServiceProvider serviceProvider,
        CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await dbContext.Database.MigrateAsync(cancellationToken);
        await InitialDataSeeder.SeedAsync(dbContext, configuration, cancellationToken);
    }
}
