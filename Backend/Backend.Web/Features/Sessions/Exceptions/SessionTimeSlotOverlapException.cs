public sealed class SessionTimeSlotOverlapException()
    : BadHttpRequestException(
        "The requested time slot overlaps with another session in the same room.",
        statusCode: StatusCodes.Status409Conflict);