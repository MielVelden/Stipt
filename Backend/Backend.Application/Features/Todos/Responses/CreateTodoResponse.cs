namespace Backend.Application.Features.Todos.Responses;

public sealed record CreateTodoResponse(
    Guid Id,
    string Title,
    string? Description,
    bool IsCompleted,
    DateTime CreatedAtUtc);
