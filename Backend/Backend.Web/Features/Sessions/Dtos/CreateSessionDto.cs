using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record CreateSessionDto(
    [param: Required, StringLength(200)] string Title,
    [param: StringLength(2000)] string? Description,
    [param: Required, StringLength(200)] string Speaker,
    [param: Required, StringLength(120)] string Room,
    [param: Required] DateTimeOffset StartTime,
    [param: Required] DateTimeOffset EndTime,
    [param: Range(1, int.MaxValue)] int? Capacity,
    [param: Required] List<string> Labels);

public sealed class CreateSessionDtoValidator : AbstractValidator<CreateSessionDto>
{
    public CreateSessionDtoValidator()
    {
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time.");
    }
}

