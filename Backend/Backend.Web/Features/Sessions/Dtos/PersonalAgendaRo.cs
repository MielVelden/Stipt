using Backend.Web.Features.Sessions.Dtos;
using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.Sessions.Dtos;

[ExportTsInterface]
public sealed record PersonalAgendaRo(
    IReadOnlyCollection<SessionRo> Sessions
);
