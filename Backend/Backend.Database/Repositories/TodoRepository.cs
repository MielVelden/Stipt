using Backend.Application.Features.Todos.Repositories;
using Backend.Database.Persistence;
using Backend.Domain.Todos;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Repositories;

internal sealed class TodoRepository(ApplicationDbContext dbContext) : ITodoRepository
{
    public async Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken)
    {
        await dbContext.Todos.AddAsync(todoItem, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Todos
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}
