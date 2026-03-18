namespace Backend.Domain.Events;

public sealed class EventStyle
{
    public required string PrimaryBackgroundColor { get; set; }
    public required string PrimaryForegroundColor { get; set; }
    public string? LogoImageUrl { get; set; }
}
