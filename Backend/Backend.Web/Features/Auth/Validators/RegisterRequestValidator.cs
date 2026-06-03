using Backend.Web.Features.Auth.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Auth.Validators;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6)
            .Matches("[A-Z]").WithMessage("Wachtwoord moet minimaal één hoofdletter bevatten.")
            .Matches("[a-z]").WithMessage("Wachtwoord moet minimaal één kleine letter bevatten.")
            .Matches("[0-9]").WithMessage("Wachtwoord moet minimaal één cijfer bevatten.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Wachtwoord moet minimaal één speciaal teken bevatten.");

        RuleFor(x => x.FirstName)
            .NotEmpty();

        RuleFor(x => x.LastName)
            .NotEmpty();
    }
}
