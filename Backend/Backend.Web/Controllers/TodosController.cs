using Backend.Application.Features.Todos.Requests;
using Backend.Application.Features.Todos.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<CreatedAtActionResult> CreateTodo(CreateTodoRequest request, CancellationToken ct)
    {
        var response = await sender.Send(request, ct);
        return CreatedAtAction(nameof(GetTodoById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetTodoByIdResponse>> GetTodoById(Guid id, CancellationToken ct)
    {
        var response = await sender.Send(new GetTodoByIdRequest(id), ct);
        return response is null ? NotFound() : Ok(response);
    }
}
