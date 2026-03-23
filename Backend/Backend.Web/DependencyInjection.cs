using FluentValidation;
using Backend.Web.Features.Events.Services;
using Backend.Web.Features.Rooms.Services;
using Backend.Web.Features.Sessions.Services;

namespace Backend.Web;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<IEventsService, EventsService>();
        services.AddScoped<IRoomsService, RoomsService>();
        services.AddScoped<ISessionsService, SessionsService>();

        return services;
    }
}

