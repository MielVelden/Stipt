using Backend.Database.Entities.Images;

namespace Backend.Web.Features.Images;

public interface IImagesService
{
    Task<Guid> UploadAsync(IFormFile file, CancellationToken ct);
    Task<Guid> UploadForUserAsync(IFormFile file, string userId, CancellationToken ct);
    Task<Image> ReadAsync(Guid imageId, CancellationToken ct);
    Task DeleteAsync(Guid imageId, CancellationToken ct);
}
