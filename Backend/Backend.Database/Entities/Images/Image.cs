namespace Backend.Database.Entities.Images;

public sealed class Image
{
    public Guid Id { get; init; }
    public required byte[] Data { get; set; }
    public required string ContentType { get; set; }
    public string? FileName { get; set; }
    public DateTime UploadedAtUtc { get; init; }
    public Guid? UploadedByUserId { get; init; }
}
