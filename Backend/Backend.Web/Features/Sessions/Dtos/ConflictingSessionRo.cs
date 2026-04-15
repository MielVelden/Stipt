using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record ConflictingSessionRo(
    Guid Id,
    string Title,
    DateTime StartDateTime,
    DateTime EndDateTime,
    string RoomName);


