using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Auth.Dtos;

[ExportTsInterface]
public sealed record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required] string FirstName,
    [Required] string LastName
);
