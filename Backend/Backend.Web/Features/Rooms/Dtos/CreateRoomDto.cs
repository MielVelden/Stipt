using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Dtos;

public sealed record CreateRoomDto(
	[param: MinLength(1), MaxLength(120)] string Name,
	[param: Range(1, int.MaxValue)] int Capacity);

public sealed class CreateRoomDtoValidator : AbstractValidator<CreateRoomDto>
{
	public CreateRoomDtoValidator()
	{
		RuleFor(x => x.Name)
			.NotEmpty()
			.MaximumLength(120);

		RuleFor(x => x.Capacity)
			.GreaterThan(0);
	}
}

