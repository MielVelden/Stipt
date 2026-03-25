using Backend.Database.Entities.Sessions;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record SessionRo(
    Guid Id,
    string Title,
    string? Description,
    SessionType Type,
    string Speaker,
    Guid RoomId,
    SessionRoomRo Room,
    Guid EventId,
    DateTime StartDateTime,
    DateTime EndDateTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);

public sealed record SessionRoomRo(
    Guid Id,
    string Name,
    int Capacity);
