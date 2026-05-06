using Backend.Database.Entities.EventParticipants;
using Backend.Web.Features.EventParticipants.Dtos;

namespace Backend.Web.Features.EventParticipants;

public static class EventParticipantMappings
{
    public static EventParticipantRo ToRo(this EventParticipant participant)
    {
        return new EventParticipantRo(
            participant.EventId,
            participant.Email,
            participant.CreatedAtUtc
        );
    }
}
