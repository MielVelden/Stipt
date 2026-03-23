using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record UpdateSessionDto(
    [param: MinLength(1), MaxLength(200)] string Title,
    [param: MaxLength(2000)] string? Description,
    [param: MinLength(1), MaxLength(200)] string Speaker,
    [param: MinLength(1), MaxLength(120)] string Room,
    [param: Required] DateTimeOffset StartTime,
    [param: Required] DateTimeOffset EndTime,
    [param: Range(1, int.MaxValue)] int? Capacity,
    [param: MaxLength(30)] List<string> Labels);

public sealed class UpdateSessionDtoValidator : AbstractValidator<UpdateSessionDto>
{
    public UpdateSessionDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Speaker)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Room)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time.");

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .When(x => x.Capacity.HasValue);

        RuleFor(x => x.Labels)
            .NotNull();
    }
}

