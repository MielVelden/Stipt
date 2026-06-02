using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Images;

internal sealed class ImageRepository(ApplicationDbContext dbContext) : IImageRepository
{
    public async Task AddAsync(Image image, CancellationToken ct)
    {
        await dbContext.Images.AddAsync(image, ct);
        await dbContext.SaveChangesAsync(ct);
    }

    public Task<Image?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return dbContext.Images
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var image = await dbContext.Images.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (image is null)
            return false;

        dbContext.Images.Remove(image);
        var result = await dbContext.SaveChangesAsync(ct);
        return result > 0;
    }
}
