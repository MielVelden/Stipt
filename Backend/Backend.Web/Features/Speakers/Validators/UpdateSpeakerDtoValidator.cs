using Backend.Web.Features.Speakers.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Speakers.Validators;

public sealed class UpdateSpeakerDtoValidator : AbstractValidator<UpdateSpeakerDto>
{
    public UpdateSpeakerDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Title)
            .MaximumLength(200);

        RuleFor(x => x.Company)
            .MaximumLength(200);

        RuleFor(x => x.Bio)
            .MaximumLength(4000);
    }
}
