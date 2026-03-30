using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Rooms.Dtos;

[ExportTsInterface]
public sealed record RoomRo(Guid Id, string Name, int Capacity, Guid EventId);
