using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Users.Dtos;

[ExportTsInterface]
public sealed record UpdateUserProfileDto(
    string FirstName,
    string LastName);

