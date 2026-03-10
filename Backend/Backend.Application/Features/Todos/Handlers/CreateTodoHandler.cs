using Backend.Application.Features.Todos.Repositories;
using Backend.Application.Features.Todos.Requests;
using Backend.Application.Features.Todos.Responses;
using Backend.Domain.Todos;
using MediatR;

namespace Backend.Application.Features.Todos.Handlers;

public sealed class CreateTodoHandler(ITodoRepository todoRepository) : IRequestHandler<CreateTodoRequest, CreateTodoResponse>
{
    public async Task<CreateTodoResponse> Handle(CreateTodoRequest request, CancellationToken cancellationToken)
    {
        var todo = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            IsCompleted = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        await todoRepository.AddAsync(todo, cancellationToken);

        return new CreateTodoResponse(todo.Id, todo.Title, todo.Description, todo.IsCompleted, todo.CreatedAtUtc);
    }
}
