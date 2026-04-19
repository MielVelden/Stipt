using Microsoft.AspNetCore.Http.Connections;

namespace Backend.Web.Configuration;

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
        var options = new HttpConnectionDispatcherOptions()
        {
            CloseOnAuthenticationExpiration = true,

        };
        //app.MapHub<ExampleHub>("/api/hub/examplehub", options);

        return app;
    }
}
