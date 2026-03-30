namespace Backend.Web.Features.Sessions.Exceptions;

public sealed class SessionTimeSlotOverlapException()
    : BadHttpRequestException(
        "Het tijdslot overlapt met een ander sessie in dezelfde ruimte.",
        statusCode: StatusCodes.Status409Conflict);