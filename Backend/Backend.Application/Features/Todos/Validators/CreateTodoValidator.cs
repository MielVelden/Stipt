using Backend.Application.Features.Todos.Requests;
using FluentValidation;

namespace Backend.Application.Features.Todos.Validators;

public sealed class CreateTodoValidator : AbstractValidator<CreateTodoRequest>
{
    public CreateTodoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Description)
            .MaximumLength(2000);
    }
}
