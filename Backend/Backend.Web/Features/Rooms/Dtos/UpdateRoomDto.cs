using System.ComponentModel.DataAnnotations;

namespace Backend.Web.Features.Rooms.Dtos;

public sealed record UpdateRoomDto(
	[param: MinLength(1), MaxLength(120)] string Name,
	[param: Range(1, int.MaxValue)] int Capacity);

