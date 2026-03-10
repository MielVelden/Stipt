namespace Backend.Application.Features.Todos.Responses;

public sealed record GetTodoByIdResponse(
    Guid Id,
    string Title,
    string? Description,
    bool IsCompleted,
    DateTime CreatedAtUtc);
