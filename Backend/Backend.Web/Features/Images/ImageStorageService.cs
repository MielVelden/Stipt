using Backend.Database.Entities.Images;

namespace Backend.Web.Features.Images;

public sealed class ImageStorageService(IImageRepository imageRepository) : IImagesService
{
    public async Task<Guid> UploadAsync(IFormFile file, CancellationToken ct)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);

        var image = new Image
        {
            Id = Guid.NewGuid(),
            Data = ms.ToArray(),
            ContentType = file.ContentType,
            FileName = file.FileName,
            UploadedAtUtc = DateTime.UtcNow
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
