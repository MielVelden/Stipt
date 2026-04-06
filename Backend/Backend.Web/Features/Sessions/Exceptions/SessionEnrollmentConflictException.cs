using Backend.Web.Features.Sessions.Dtos;

namespace Backend.Web.Features.Sessions.Exceptions;

public sealed class SessionEnrollmentConflictException(IReadOnlyCollection<ConflictingSessionRo> conflictingSessions)
    : Exception("Deze sessie overlapt met een sessie in jouw agenda.")
{
    public IReadOnlyCollection<ConflictingSessionRo> ConflictingSessions { get; } = conflictingSessions;
}

