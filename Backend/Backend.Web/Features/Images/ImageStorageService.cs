using Backend.Database.Entities.Images;

namespace Backend.Web.Features.Images;

public sealed class ImageStorageService(IImageRepository imageRepository) : IImagesService
{
    public Task<Guid> UploadAsync(IFormFile file, CancellationToken ct)
    {
        return UploadInternalAsync(file, null, ct);
    }

    public Task<Guid> UploadForUserAsync(IFormFile file, string userId, CancellationToken ct)
    {
        return UploadInternalAsync(file, userId, ct);
    }

    private async Task<Guid> UploadInternalAsync(IFormFile file, string? userId, CancellationToken ct)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);

        var image = new Image
        {
            Id = Guid.NewGuid(),
            Data = ms.ToArray(),
            ContentType = file.ContentType,
            FileName = file.FileName,
            UploadedAtUtc = DateTime.UtcNow,
            UploadedByUserId = Guid.TryParse(userId, out var parsedId) ? parsedId : null
        };

        await imageRepository.AddAsync(image, ct);
        return image.Id;
    }

    public async Task<Image> ReadAsync(Guid imageId, CancellationToken ct)
    {
        var image = await imageRepository.GetByIdAsync(imageId, ct);
        if (image is null)
            throw new BadHttpRequestException("Afbeelding niet gevonden.", StatusCodes.Status404NotFound);
        return image;
    }

    public async Task DeleteAsync(Guid imageId, CancellationToken ct)
    {
        var deleted = await imageRepository.DeleteAsync(imageId, ct);
        if (!deleted)
            throw new BadHttpRequestException("Afbeelding niet gevonden.", StatusCodes.Status404NotFound);
    }
}
