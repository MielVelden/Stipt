using Microsoft.AspNetCore.Mvc;

namespace Backend.Web.Features.Sessions.Dtos;

public sealed record SessionFilterDto(
     public  List<string>? Labels = null,
     public bool? AvailableOnly = false
);