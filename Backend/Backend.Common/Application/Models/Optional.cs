namespace Backend.Common.Application.Models;

public readonly struct Optional<T>(T? value)
{
    public readonly T? Value = value;
    public bool HasValue { get; } = true;

    public void IfPresent(Action<T> action)
    {
        if (HasValue)
        {
            action(Value!);
        }
    }

    public static implicit operator Optional<T>(T? value) => new(value);
}