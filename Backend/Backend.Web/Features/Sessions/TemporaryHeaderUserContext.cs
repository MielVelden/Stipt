namespace Backend.Web.Features.Sessions;

public sealed class TemporaryHeaderUserContext
{
    private const string UserHeaderName = "X-User-Id";

    public Guid GetUserId(HttpContext httpContext)
    {
        if (httpContext.Request.Headers.TryGetValue(UserHeaderName, out var headerValues)
            && Guid.TryParse(headerValues.FirstOrDefault(), out var userId))
        {
            return userId;
        }

        throw new BadHttpRequestException(
            $"Header '{UserHeaderName}' moet een geldige id bevatten.",
            StatusCodes.Status400BadRequest);
    }
}

