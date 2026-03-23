using System.ComponentModel.DataAnnotations;

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

