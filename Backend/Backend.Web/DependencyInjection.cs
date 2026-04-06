using Backend.Web.Features.Events;
using Backend.Web.Features.Rooms;
using Backend.Web.Features.Sessions;
using FluentValidation;

namespace Backend.Web;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<EventsService>();
        services.AddScoped<RoomsService>();
        services.AddScoped<SessionsService>();
        services.AddScoped<TemporaryHeaderUserContext>();

        return services;
    }
}

