using Backend.Web.Features.Rooms.Requests;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Validators;

public class CreateRoomValidator : AbstractValidator<CreateRoomRequest>
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