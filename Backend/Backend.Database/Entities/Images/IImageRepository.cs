namespace Backend.Database.Entities.Images;

public interface IImageRepository
{
    Task AddAsync(Image image, CancellationToken ct);
    Task<Image?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
