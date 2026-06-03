using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Auth.Dtos;

[ExportTsInterface]
public sealed record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName
);
