using Backend.Application.Features.Sessions.Requests;
using Backend.Application.Features.Sessions.Responses;
using Backend.Common.Web;
using MediatR;

namespace Backend.Web.Endpoints.Sessions;

public sealed class SessionEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/sessions")
            .WithTags("Sessions");

        group.MapPost("/", CreateSession)
            .WithName("CreateSession")
            .Produces<CreateSessionResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict)
            .WithOpenApi();

        group.MapGet("/", GetAllSessions)
            .WithName("GetAllSessions")
            .Produces<IReadOnlyCollection<GetAllSessionsResponse>>()
            .WithOpenApi();

        group.MapGet("/{id:guid}", GetSessionById)
            .WithName("GetSessionById")
            .Produces<GetSessionByIdResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

        group.MapPut("/{id:guid}", UpdateSession)
            .WithName("UpdateSession")
            .Produces<UpdateSessionResponse>()
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

        group.MapDelete("/{id:guid}", DeleteSession)
            .WithName("DeleteSession")
            .Produces<DeleteSessionResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();
    }

    private static async Task<IResult> CreateSession(
        CreateSessionRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(request, cancellationToken);
        return Results.Created($"/api/sessions/{response.Id}", response);
    }

    private static async Task<IResult> DeleteSession(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new DeleteSessionRequest(id), cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> GetAllSessions(
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetAllSessionsRequest(), cancellationToken);
        return Results.Ok(response);
    }

    private static async Task<IResult> GetSessionById(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetSessionByIdRequest(id), cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> UpdateSession(
        Guid id,
        UpdateSessionRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(request with { Id = id }, cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }
}
