using Backend.Application.Features.Rooms.Requests;
using Backend.Application.Features.Rooms.Responses;
using Backend.Common.Web;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Endpoints.Rooms;

public sealed class RoomEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/rooms")
            .WithTags("Rooms");

        group.MapPost("/", CreateRoom)
            .WithName("CreateRoom")
            .Produces<CreateRoomResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .WithOpenApi();

        group.MapGet("/", GetAllRooms)
            .WithName("GetAllRooms")
            .Produces<List<GetRoomResponse>>()
            .WithOpenApi();

        group.MapGet("/{id:guid}", GetRoomById)
            .WithName("GetRoomById")
            .Produces<GetRoomResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

        group.MapPut("/{id:guid}", UpdateRoom)
            .WithName("UpdateRoom")
            .Produces<UpdateRoomResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();

        group.MapDelete("/{id:guid}", DeleteRoom)
            .WithName("DeleteRoom")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi();
    }

    private static async Task<IResult> CreateRoom(CreateRoomRequest request, ISender sender, CancellationToken ct)
    {
        var response = await sender.Send(request, ct);
        return Results.Created($"/api/rooms/{response.Id}", response);
    }

    private static async Task<IResult> GetAllRooms(ISender sender, CancellationToken ct)
    {
        var response = await sender.Send(new GetAllRoomsRequest(), ct);
        return Results.Ok(response);
    }

    private static async Task<IResult> GetRoomById(Guid id, ISender sender, CancellationToken ct)
    {
        var response = await sender.Send(new GetRoomByIdRequest(id), ct);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> UpdateRoom(Guid id, UpdateRoomRequest request, ISender sender, CancellationToken ct)
    {
        var response = await sender.Send(request with { Id = id }, ct);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }

    private static async Task<IResult> DeleteRoom(Guid id, ISender sender, CancellationToken ct)
    {
        await sender.Send(new DeleteRoomRequest(id), ct);
        return Results.NoContent();
    }
}