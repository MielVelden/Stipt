using Backend.Database.Entities.Speakers;
using Backend.Web.Features.Speakers.Dtos;

namespace Backend.Web.Features.Speakers;

public sealed class SpeakersService(ISpeakerRepository speakerRepository)
{
    public async Task<SpeakerRo> CreateAsync(Guid eventId, CreateSpeakerDto request, CancellationToken cancellationToken)
    {
        var speaker = new Speaker
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Title = request.Title?.Trim(),
            Company = request.Company?.Trim(),
            Bio = request.Bio?.Trim(),
            PhotoId = request.PhotoId,
            EventId = eventId,
            CreatedAtUtc = DateTime.UtcNow
        };

        await speakerRepository.CreateAsync(speaker, cancellationToken);

        return speaker.ToRo();
    }

    public async Task<List<SpeakerRo>> GetAllAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var speakers = await speakerRepository.GetAllAsync(eventId, cancellationToken);
        return speakers.Select(s => s.ToRo()).ToList();
    }

    public async Task<SpeakerRo?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        var speaker = await speakerRepository.GetByIdAsync(eventId, id, cancellationToken);
        return speaker is null ? null : speaker.ToRo();
    }

    public async Task<SpeakerRo?> UpdateAsync(Guid eventId, Guid id, UpdateSpeakerDto request, CancellationToken cancellationToken)
    {
        var speaker = await speakerRepository.GetByIdAsync(eventId, id, cancellationToken);
        if (speaker is null)
            return null;

        speaker.Name = request.Name.Trim();
        speaker.Title = request.Title?.Trim();
        speaker.Company = request.Company?.Trim();
        speaker.Bio = request.Bio?.Trim();
        speaker.PhotoId = request.PhotoId;
        speaker.UpdatedAtUtc = DateTime.UtcNow;

        await speakerRepository.UpdateAsync(speaker, cancellationToken);

        return speaker.ToRo();
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return await speakerRepository.DeleteAsync(eventId, id, cancellationToken);
    }
}
