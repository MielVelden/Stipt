using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Auth.Dtos;

[ExportTsInterface]
public sealed record RefreshResponse(string AccessToken, string RefreshToken);
