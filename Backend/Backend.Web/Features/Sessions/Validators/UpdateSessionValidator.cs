using Backend.Web.Features.Sessions.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class UpdateSessionValidator : AbstractValidator<UpdateSessionDto>
{
    public UpdateSessionValidator()
    {
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time.");
    }
}
