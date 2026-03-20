using Backend.Application.Features.Events.Requests;
using Backend.Application.Features.Events.Responses;
using Backend.Common.Web;
using MediatR;

namespace Backend.Web.Endpoints.Events;

public sealed class EventEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/events")
            .WithTags("Events");

        group.MapPost("/", CreateEvent)
            .WithName("CreateEvent")
            .Produces<CreateEventResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .WithOpenApi();

        group.MapGet("/{id:guid}", GetEventById)
            .WithName("GetEventById")
            .Produces<GetEventByIdResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

        group.MapGet("/", GetAllEvents)
            .WithName("GetAllEvents")
            .Produces<List<GetAllEventsResponse>>()
            .WithOpenApi();

        group.MapPut("/{id:guid}", UpdateEvent)
            .WithName("UpdateEvent")
            .Produces<UpdateEventResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .ProducesValidationProblem()
            .WithOpenApi();

        group.MapDelete("/{id:guid}", DeleteEvent)
            .WithName("DeleteEvent")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();
    }

    private static async Task<IResult> CreateEvent(
        CreateEventRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(request, cancellationToken);
        return Results.Created($"/api/events/{response.Id}", response);
    }

    private static async Task<IResult> GetEventById(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetEventByIdRequest(id), cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> GetAllEvents(
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetAllEventsRequest(), cancellationToken);
        return Results.Ok(response);
    }

    private static async Task<IResult> UpdateEvent(
        Guid id,
        UpdateEventRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateEventCommand(id, request);
        var response = await sender.Send(command, cancellationToken);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> DeleteEvent(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(new DeleteEventRequest(id), cancellationToken);
        return deleted ? Results.NoContent() : Results.NotFound();
    }
}
