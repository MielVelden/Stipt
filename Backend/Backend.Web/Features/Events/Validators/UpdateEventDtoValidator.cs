using Backend.Web.Features.Events.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Events.Validators;

public sealed class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Location)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(x => x.EndDate)
            .WithMessage("Start date must be before or equal to end date.");

        RuleFor(x => x.Style)
            .SetValidator(new UpdateEventStyleDtoValidator());
    }
}

public sealed class UpdateEventStyleDtoValidator : AbstractValidator<UpdateEventStyleDto>
{
    public UpdateEventStyleDtoValidator()
    {
        RuleFor(x => x.PrimaryBackgroundColor)
            .NotEmpty()
            .Length(7);

        RuleFor(x => x.PrimaryForegroundColor)
            .NotEmpty()
            .Length(7);

        RuleFor(x => x.LogoImageUrl)
            .Must(url => url is null || url.Length <= 2000)
            .WithMessage("Logo image URL must be 2000 characters or fewer.");
    }
}

