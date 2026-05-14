using Backend.Web.Features.Images.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Images;

[ApiController]
[Route("api/images")]
[Authorize]
public sealed class ImagesController(IImageStorageService imageStorageService) : ControllerBase
{
    private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    [HttpPost]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<ActionResult<UploadImageRo>> UploadImage(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest("No file provided.");

        if (!AllowedContentTypes.Contains(file.ContentType))
            return BadRequest("Only JPEG, PNG, and WebP images are allowed.");

        if (file.Length > MaxFileSizeBytes)
            return BadRequest("Image size must not exceed 5 MB.");

        var imageId = await imageStorageService.UploadAsync(file, ct);
        return Ok(new UploadImageRo(imageId));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetImage(Guid id, CancellationToken ct)
    {
        var image = await imageStorageService.ReadAsync(id, ct);
        return File(image.Data, image.ContentType, image.FileName);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.Manager)]
    public async Task<IActionResult> DeleteImage(Guid id, CancellationToken ct)
    {
        await imageStorageService.DeleteAsync(id, ct);
        return NoContent();
    }
}
