using Backend.Web.Features.Sessions.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class EnrollSessionDtoValidator : AbstractValidator<EnrollSessionDto>
{
    public EnrollSessionDtoValidator()
    {
        RuleFor(x => x.ParticipantId)
            .NotEmpty()
            .WithMessage("ParticipantId is required.");
    }
}
