using Backend.Database.Entities.Sessions;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
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

