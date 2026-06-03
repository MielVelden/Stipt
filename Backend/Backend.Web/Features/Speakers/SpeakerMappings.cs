using Backend.Database.Entities.Speakers;
using Backend.Web.Features.Speakers.Dtos;

namespace Backend.Web.Features.Speakers;

public static class SpeakerMappings
{
    public static SpeakerRo ToRo(this Speaker speaker)
    {
        return new SpeakerRo(
            speaker.Id,
            speaker.Name,
            speaker.Title,
            speaker.Company,
            speaker.Bio,
            speaker.EventId,
            speaker.PhotoId,
            speaker.CreatedAtUtc,
            speaker.UpdatedAtUtc);
    }
}
