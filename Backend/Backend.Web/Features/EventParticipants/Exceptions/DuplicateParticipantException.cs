namespace Backend.Web.Features.EventParticipants.Exceptions;

public sealed class DuplicateParticipantException()
    : Exception("Deze deelnemer is al toegevoegd aan dit evenement.");
