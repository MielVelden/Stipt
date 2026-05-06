using Backend.Web.Features.EventParticipants.Dtos;
using FluentValidation;

namespace Backend.Web.Features.EventParticipants.Validators;

public sealed class CreateEventParticipantDtoValidator : AbstractValidator<CreateEventParticipantDto>
{
    public CreateEventParticipantDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .MaximumLength(320)
            .EmailAddress();
    }
}
