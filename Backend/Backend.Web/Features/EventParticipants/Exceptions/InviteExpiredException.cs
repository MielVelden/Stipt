namespace Backend.Web.Features.EventParticipants.Exceptions;

public sealed class InviteExpiredException()
    : Exception("Deze uitnodigingscode is verlopen. Neem contact op met de organisatie voor een nieuwe uitnodiging.");
