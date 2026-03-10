namespace Backend.Domain.Todos;

public sealed class TodoItem
{
    public Guid Id { get; init; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAtUtc { get; init; }
}
