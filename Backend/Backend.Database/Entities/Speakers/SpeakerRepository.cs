using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Speakers;

internal sealed class SpeakerRepository(ApplicationDbContext dbContext) : ISpeakerRepository
{
    public async Task<Guid> CreateAsync(Speaker speaker, CancellationToken ct)
    {
        await dbContext.Speakers.AddAsync(speaker, ct);
        await dbContext.SaveChangesAsync(ct);
        return speaker.Id;
    }

    public Task<List<Speaker>> GetAllAsync(Guid eventId, CancellationToken ct)
    {
        return dbContext.Speakers
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);
    }

    public Task<Speaker?> GetByIdAsync(Guid eventId, Guid id, CancellationToken ct)
    {
        return dbContext.Speakers
            .AsNoTracking()
            .Include(x => x.Photo)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, ct);
    }

    public async Task UpdateAsync(Speaker speaker, CancellationToken ct)
    {
        dbContext.Speakers.Update(speaker);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken ct)
    {
        var speaker = await dbContext.Speakers
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, ct);

        if (speaker is null)
            return false;

        dbContext.Speakers.Remove(speaker);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }

    public Task<List<Speaker>> GetByIdsAsync(Guid eventId, IEnumerable<Guid> ids, CancellationToken ct)
    {
        var idList = ids.ToList();
        return dbContext.Speakers
            .Where(s => s.EventId == eventId && idList.Contains(s.Id))
            .ToListAsync(ct);
    }
}
