using TypeGen.Core.TypeAnnotations;
using Backend.Web.Features.Users.Dtos;

namespace Backend.Web.Features.Auth.Dtos;

[ExportTsInterface]
public sealed record LoginResponse(
    string AccessToken, 
    UserRo User);