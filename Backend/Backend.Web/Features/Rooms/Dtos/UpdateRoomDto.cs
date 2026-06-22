using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Rooms.Dtos;

[ExportTsInterface]
public sealed record UpdateRoomDto(
    string Name,
    int Capacity);

