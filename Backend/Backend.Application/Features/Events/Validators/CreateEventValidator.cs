using Backend.Application.Features.Events.Requests;
using FluentValidation;

namespace Backend.Application.Features.Events.Validators;

public sealed class CreateEventValidator : AbstractValidator<CreateEventRequest>
{
    public CreateEventValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Location)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .LessThan(x => x.EndDate)
            .WithMessage("Start date must be before end date");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .GreaterThan(x => x.StartDate)
            .WithMessage("End date must be after start date");

        RuleFor(x => x.Style)
            .NotNull()
            .SetValidator(new EventStyleValidator());
    }
}

public sealed class EventStyleValidator : AbstractValidator<EventStyleDto>
{
    public EventStyleValidator()
    {
        RuleFor(x => x.PrimaryBackgroundColor)
            .NotEmpty()
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
            .WithMessage("Primary background color must be a valid hex color (e.g., #FFFFFF)");

        RuleFor(x => x.PrimaryForegroundColor)
            .NotEmpty()
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
            .WithMessage("Primary foreground color must be a valid hex color (e.g., #000000)");

        RuleFor(x => x.LogoImageUrl)
            .MaximumLength(2000)
            .Must(BeAValidUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.LogoImageUrl))
            .WithMessage("Logo image URL must be a valid URL");
    }

    private bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
