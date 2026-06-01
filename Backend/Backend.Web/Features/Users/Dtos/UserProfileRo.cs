using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Users.Dtos;

[ExportTsInterface]
public sealed record UserProfileRo(
    string Email,
    string FirstName,
    string LastName,
    string Phone);

