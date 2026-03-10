using MediatR;
using Backend.Application.Features.Todos.Responses;

namespace Backend.Application.Features.Todos.Requests;

public sealed record CreateTodoRequest(string Title, string? Description) : IRequest<CreateTodoResponse>;
