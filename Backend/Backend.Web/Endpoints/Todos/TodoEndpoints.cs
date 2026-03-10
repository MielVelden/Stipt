using Backend.Application.Features.Todos.Requests;
using Backend.Application.Features.Todos.Responses;
using Backend.Common.Web;
using MediatR;

namespace Backend.Web.Endpoints.Todos;

public sealed class TodoEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/todos")
            .WithTags("Todos");

        group.MapPost("/", CreateTodo)
            .WithName("CreateTodo")
            .Produces<CreateTodoResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .WithOpenApi();

        group.MapGet("/{id:guid}", GetTodoById)
            .WithName("GetTodoById")
            .Produces<GetTodoByIdResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();
    }

    private static async Task<IResult> CreateTodo(
        CreateTodoRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(request, cancellationToken);
        return Results.Created($"/api/todos/{response.Id}", response);
    }

    private static async Task<IResult> GetTodoById(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetTodoByIdRequest(id), cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }
}
