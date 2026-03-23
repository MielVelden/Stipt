using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace Backend.Web.Configuration;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage).ToArray());

            await Results.ValidationProblem(errors).ExecuteAsync(httpContext);
            return true;
        }

        logger.LogError(exception, "Unhandled exception");
        return false;
    }
}
