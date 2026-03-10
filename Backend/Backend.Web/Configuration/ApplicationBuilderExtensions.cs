using Backend.Common.Web;

namespace Backend.Web.Configuration;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseWebApi(this WebApplication app)
    {
        app.UseExceptionHandler();

        app.UseHttpsRedirection();
        app.UseAuthorization();

        app.MapEndpointDefinitions();

        return app;
    }
}
