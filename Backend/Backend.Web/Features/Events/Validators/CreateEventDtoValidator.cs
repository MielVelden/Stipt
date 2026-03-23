using Backend.Web.Features.Events.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Events.Validators;

public sealed class CreateEventDtoValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Location)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(x => x.StartDate)
            .LessThan(x => x.EndDate)
            .WithMessage("Start date must be before end date.");

        RuleFor(x => x.Style)
            .NotNull()
            .SetValidator(new CreateEventStyleDtoValidator());
    }
}

public sealed class CreateEventStyleDtoValidator : AbstractValidator<CreateEventStyleDto>
{
    public CreateEventStyleDtoValidator()
    {
        RuleFor(x => x.PrimaryBackgroundColor)
            .NotEmpty()
            .Length(7);

        RuleFor(x => x.PrimaryForegroundColor)
            .NotEmpty()
            .Length(7);

        RuleFor(x => x.LogoImageUrl)
            .MaximumLength(2000);
    }
}

