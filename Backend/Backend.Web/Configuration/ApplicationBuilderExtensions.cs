namespace Backend.Web.Configuration;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseWebApi(this WebApplication app)
    {
        app.UseExceptionHandler();

        app.UseHttpsRedirection();

        app.UseCors();

        app.UseAuthorization();

        app.MapControllers();

        return app;
    }
}
