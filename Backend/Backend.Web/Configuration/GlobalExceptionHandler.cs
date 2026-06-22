using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Backend.Web.Features.Sessions.Exceptions;
using Backend.Web.Features.EventParticipants.Exceptions;

namespace Backend.Web.Configuration;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        switch (exception)
        {
            case ValidationException validationException:
            {
                var errors = validationException.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage).ToArray());

                await Results.ValidationProblem(errors).ExecuteAsync(httpContext);
                return true;
            }
            case BadHttpRequestException badHttpRequestException:
            {
                await Results.Problem(
                    detail: badHttpRequestException.Message,
                    statusCode: badHttpRequestException.StatusCode
                ).ExecuteAsync(httpContext);

                return true;
            }
            case SessionEnrollmentConflictException conflictException:
            {
                await Results.Json(
                    new
                    {
                        message = conflictException.Message,
                        conflictingSessions = conflictException.ConflictingSessions
                    },
                    statusCode: StatusCodes.Status409Conflict).ExecuteAsync(httpContext);

                return true;
            }
            case InviteNotFoundException inviteNotFoundException:
            {
                await Results.Problem(
                    detail: inviteNotFoundException.Message,
                    statusCode: StatusCodes.Status404NotFound
                ).ExecuteAsync(httpContext);

                return true;
            }
            case InviteExpiredException inviteExpiredException:
            {
                await Results.Problem(
                    detail: inviteExpiredException.Message,
                    statusCode: StatusCodes.Status410Gone
                ).ExecuteAsync(httpContext);

                return true;
            }
            case DuplicateParticipantException duplicateException:
            {
                await Results.Problem(
                    detail: duplicateException.Message,
                    statusCode: StatusCodes.Status409Conflict
                ).ExecuteAsync(httpContext);

                return true;
            }
            default:
            {
                logger.LogError(exception, "Unhandled exception");
                return false;
            }
        }
    }
}
