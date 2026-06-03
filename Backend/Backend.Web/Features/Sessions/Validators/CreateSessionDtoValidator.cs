using Backend.Web.Features.Sessions.Dtos;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Validators;

public sealed class CreateSessionDtoValidator : AbstractValidator<CreateSessionDto>
{
    public CreateSessionDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Type)
            .IsInEnum();

        RuleFor(x => x.RoomId)
            .NotEmpty()
            .WithMessage("RoomId is required.");

        RuleFor(x => x.StartDateTime)
            .LessThan(x => x.EndDateTime)
            .WithMessage("StartDateTime must be before EndDateTime.");

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .When(x => x.Capacity.HasValue);

        RuleFor(x => x.Labels)
            .NotNull();
    }
}

