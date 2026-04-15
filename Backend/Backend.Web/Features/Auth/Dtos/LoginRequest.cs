using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Auth.Dtos;

[ExportTsInterface]
public sealed record LoginRequest(string Email, string Password);
