using Backend.Domain.Todos;

namespace Backend.Application.Features.Todos.Repositories;

public interface ITodoRepository
{
    Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken);
    Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
}
