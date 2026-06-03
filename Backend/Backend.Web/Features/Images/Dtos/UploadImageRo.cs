using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Images.Dtos;

[ExportTsInterface]
public sealed record UploadImageRo(Guid ImageId);
