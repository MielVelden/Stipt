using Backend.Web.Features.Rooms.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Validators;

public sealed class UpdateRoomDtoValidator : AbstractValidator<UpdateRoomDto>
{
    public UpdateRoomDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Capacity)
            .GreaterThan(0);
    }
}

