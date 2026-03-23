using System.ComponentModel.DataAnnotations;

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

