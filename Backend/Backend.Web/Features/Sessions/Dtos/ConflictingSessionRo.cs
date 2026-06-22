using NodaTime;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record ConflictingSessionRo(
    Guid Id,
    string Title,
    LocalDateTime StartDateTime,
    LocalDateTime EndDateTime,
    string RoomName);


