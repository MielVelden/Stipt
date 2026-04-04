using Backend.Web.Features.Sessions.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class ReplaceSessionEnrollmentDtoValidator : AbstractValidator<ReplaceSessionEnrollmentDto>
{
    public ReplaceSessionEnrollmentDtoValidator()
    {
        RuleFor(x => x.ParticipantId)
            .NotEmpty()
            .WithMessage("ParticipantId is required.");

        RuleFor(x => x.SessionIdToUnenroll)
            .NotEmpty()
            .WithMessage("SessionIdToUnenroll is required.");
    }
}
