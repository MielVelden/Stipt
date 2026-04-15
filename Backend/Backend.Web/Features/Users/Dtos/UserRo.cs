using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Users.Dtos;

[ExportTsInterface]
public sealed record UserRo(
    Guid Id, 
    string Email, 
    string FirstName, 
    string LastName, 
    IList<string> Roles);