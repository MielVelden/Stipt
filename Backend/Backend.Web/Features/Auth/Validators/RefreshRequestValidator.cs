using Backend.Web.Features.Auth.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Auth.Validators;

public sealed class RefreshRequestValidator : AbstractValidator<RefreshRequest>
{
    public RefreshRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}
