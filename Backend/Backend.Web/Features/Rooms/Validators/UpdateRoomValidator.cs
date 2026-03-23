using Backend.Web.Features.Rooms.Requests;
using FluentValidation;

namespace Backend.Web.Features.Rooms.Validators;

public class UpdateRoomValidator : AbstractValidator<UpdateRoomRequest>
{
    public UpdateRoomValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Capacity)
            .NotEmpty()
            .GreaterThan(0);
    }
}