namespace Backend.Database.Entities.Rooms;

public sealed class Room
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required int Capacity { get; set; }
}

