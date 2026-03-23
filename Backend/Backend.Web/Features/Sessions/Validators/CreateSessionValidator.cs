using Backend.Web.Features.Sessions.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class CreateSessionValidator : AbstractValidator<CreateSessionDto>
{
    public CreateSessionValidator()
    {
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time.");
    }
}
