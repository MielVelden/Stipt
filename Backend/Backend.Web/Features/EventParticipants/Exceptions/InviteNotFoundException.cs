namespace Backend.Web.Features.EventParticipants.Exceptions;

public sealed class InviteNotFoundException()
    : Exception("Deze uitnodigingscode is niet beschikbaar. Controleer of je de juiste code gebruikt of neem contact op met de organisatie.");
