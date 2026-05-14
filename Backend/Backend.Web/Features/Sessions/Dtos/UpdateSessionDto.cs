using Backend.Database.Entities.Sessions;
using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record UpdateSessionDto(
    string Title,
    string? Description,
    SessionType Type,
    string Speaker,
    Guid RoomId,
    LocalDateTime StartDateTime,
    LocalDateTime EndDateTime,
    int? Capacity,
    List<string> Labels,
    Guid? CoverImageId = null);

