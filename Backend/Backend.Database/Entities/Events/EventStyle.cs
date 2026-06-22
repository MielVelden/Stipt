using Backend.Database.Entities.Images;

namespace Backend.Database.Entities.Events;

public sealed class EventStyle
{
    public required string PrimaryBackgroundColor { get; set; }
    public required string PrimaryForegroundColor { get; set; }
    public Guid? LogoImageId { get; set; }
    public Image? LogoImage { get; set; }
}

