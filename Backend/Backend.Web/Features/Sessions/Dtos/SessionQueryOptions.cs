namespace Backend.Web.Features.Sessions.Dtos;

public sealed class SessionQueryOptions
{
    public bool IncludeRegistrationCount { get; init; } = false;
}
