using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record SessionFilterDto(
    [FromQuery] List<string>? Labels = null,
    [FromQuery] bool? AvailableOnly = false
);