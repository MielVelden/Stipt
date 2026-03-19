using Backend.Application.Features.Sessions.Responses;
using MediatR;

namespace Backend.Application.Features.Sessions.Requests;

public sealed record CreateSessionRequest(
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    List<string> Tags) : IRequest<CreateSessionResponse>;
