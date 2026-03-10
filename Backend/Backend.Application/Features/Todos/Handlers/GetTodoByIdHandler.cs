using Backend.Application.Features.Todos.Repositories;
using Backend.Application.Features.Todos.Requests;
using Backend.Application.Features.Todos.Responses;
using MediatR;

namespace Backend.Application.Features.Todos.Handlers;

public sealed class GetTodoByIdHandler(ITodoRepository todoRepository)
    : IRequestHandler<GetTodoByIdRequest, GetTodoByIdResponse?>
{
    public async Task<GetTodoByIdResponse?> Handle(GetTodoByIdRequest request, CancellationToken cancellationToken)
    {
        var todo = await todoRepository.GetByIdAsync(request.Id, cancellationToken);
        if (todo is null)
        {
            return null;
        }

        return new GetTodoByIdResponse(todo.Id, todo.Title, todo.Description, todo.IsCompleted, todo.CreatedAtUtc);
    }
}
