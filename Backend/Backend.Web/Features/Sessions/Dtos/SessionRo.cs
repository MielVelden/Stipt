using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Enums;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
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
    DateTime? UpdatedAtUtc,
    SessionAvailability Availability,
    int currentAttendeeCount);
    

[ExportTsInterface]
public sealed record SessionRoomRo(
    Guid Id,
    string Name,
    int Capacity);
