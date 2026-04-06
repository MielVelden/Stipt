namespace Backend.Web.Features.Sessions.Dtos;

public sealed record SessionFilterDto(
    List<string>? Labels = null,
    bool? AvailableOnly = false
);
