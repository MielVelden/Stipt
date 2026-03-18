using Backend.Common.Application;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Backend.Common.Web;

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

        if (exception is ConflictException conflictException)
        {
            await Results.Problem(
                    statusCode: StatusCodes.Status409Conflict,
                    title: "Conflict",
                    detail: conflictException.Message)
                .ExecuteAsync(httpContext);

            return true;
        }

        logger.LogError(exception, "Unhandled exception");
        return false;
    }
}
