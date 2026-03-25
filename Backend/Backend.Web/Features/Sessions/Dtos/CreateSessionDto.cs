using Backend.Database.Entities.Sessions;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record CreateSessionDto(
    string Title,
    string? Description,
    SessionType Type,
    string Speaker,
    Guid RoomId,
    DateTime StartDateTime,
    DateTime EndDateTime,
    int? Capacity,
    List<string> Labels);

