using Backend.Application.Features.Events.Repositories;
using Backend.Application.Features.Sessions.Repositories;
using Backend.Application.Features.Todos.Repositories;
using Backend.Database.Persistence;
using Backend.Database.Repositories;
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

        services.AddScoped<ITodoRepository, TodoRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        // TODO change to scoped after implementing full repository
        services.AddSingleton<ISessionRepository, MockSessionRepository>();

        return services;
    }
}
