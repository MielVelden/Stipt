using Backend.Application.Features.Sessions.Responses;
using MediatR;
using NodaTime;

namespace Backend.Application.Features.Sessions.Requests;

public sealed record CreateSessionRequest(
    string Title,
    string Description,
    string Speaker,
    string Room,
    Instant StartTime,
    Instant EndTime,
    int? Capacity,
    List<string> Labels) : IRequest<CreateSessionResponse>;
