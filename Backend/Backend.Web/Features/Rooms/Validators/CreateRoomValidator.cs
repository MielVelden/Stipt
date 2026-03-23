using Backend.Web.Features.Rooms.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Validators;

public class CreateRoomValidator : AbstractValidator<CreateRoomDto>
{
    public CreateRoomValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Capacity)
            .NotEmpty()
            .GreaterThan(0);
    }
}