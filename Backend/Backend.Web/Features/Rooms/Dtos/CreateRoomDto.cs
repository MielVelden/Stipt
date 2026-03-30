using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Rooms.Dtos;

[ExportTsInterface]
public sealed record CreateRoomDto(
    string Name,
    int Capacity);

