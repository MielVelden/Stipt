namespace Backend.Web.Features.EventParticipants.Dtos;

public sealed record InviteDetailsRo(
    Guid EventId,
    string EventName,
    bool IsAlreadyLinked);
