using Backend.Web.Features.Events.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Events.Validators;

public sealed class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .Must(name => !name.HasValue || !string.IsNullOrWhiteSpace(name.Value))
            .WithMessage("Name must not be empty.")
            .Must(name => !name.HasValue || name.Value!.Length <= 200)
            .WithMessage("Name must be 200 characters or fewer.");

        RuleFor(x => x.Location)
            .Must(location => !location.HasValue || !string.IsNullOrWhiteSpace(location.Value))
            .WithMessage("Location must not be empty.")
            .Must(location => !location.HasValue || location.Value!.Length <= 500)
            .WithMessage("Location must be 500 characters or fewer.");

        RuleFor(x => x)
            .Must(x =>
                !x.StartDate.HasValue ||
                !x.EndDate.HasValue ||
                x.StartDate.Value < x.EndDate.Value)
            .WithMessage("Start date must be before end date.");

        RuleFor(x => x.Style)
            .Must(style => !style.HasValue || style.Value is not null)
            .WithMessage("Style must not be null.");

        RuleFor(x => x.Style.Value!)
            .SetValidator(new UpdateEventStyleDtoValidator())
            .When(x => x.Style.HasValue && x.Style.Value is not null);
    }
}

public sealed class UpdateEventStyleDtoValidator : AbstractValidator<UpdateEventStyleDto>
{
    public UpdateEventStyleDtoValidator()
    {
        RuleFor(x => x.PrimaryBackgroundColor)
            .Must(color => !color.HasValue || !string.IsNullOrWhiteSpace(color.Value))
            .WithMessage("Primary background color must not be empty.")
            .Must(color => !color.HasValue || color.Value!.Length == 7)
            .WithMessage("Primary background color must be exactly 7 characters.");

        RuleFor(x => x.PrimaryForegroundColor)
            .Must(color => !color.HasValue || !string.IsNullOrWhiteSpace(color.Value))
            .WithMessage("Primary foreground color must not be empty.")
            .Must(color => !color.HasValue || color.Value!.Length == 7)
            .WithMessage("Primary foreground color must be exactly 7 characters.");

        RuleFor(x => x.LogoImageUrl)
            .Must(url => !url.HasValue || url.Value is null || url.Value.Length <= 2000)
            .WithMessage("Logo image URL must be 2000 characters or fewer.");
    }
}

