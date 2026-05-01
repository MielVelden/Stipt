using Backend.Web.Features.Sessions;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Configuration;

[ExportTsEnum]
public enum HubMessageTypeEnum
{
    SessionEnrollmentUpdated
}

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseWebApi(this WebApplication app)
    {
        app.UseExceptionHandler();

        app.UseHttpsRedirection();

        return app;
    }

    public static WebApplication AddHubs(this WebApplication app)
    {
        app.MapHub<SessionsHub>("/api/hub/sessions", options =>
        {
            options.CloseOnAuthenticationExpiration = true;
        });

        return app;
    }
}
