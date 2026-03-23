using Backend.Web.Features.Sessions.Requests;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class UpdateSessionValidator : AbstractValidator<UpdateSessionRequest>
{
    public UpdateSessionValidator()
    {
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time.");
    }
}
