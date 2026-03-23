using Backend.Web.Features.Sessions.Responses;
using MediatR;

namespace Backend.Web.Features.Sessions.Requests;

public sealed record CreateSessionRequest(
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    List<string> Labels) : IRequest<CreateSessionResponse>;
