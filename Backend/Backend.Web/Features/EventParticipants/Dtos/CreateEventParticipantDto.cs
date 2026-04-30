using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.EventParticipants.Dtos;

[ExportTsInterface]
public sealed record CreateEventParticipantDto(
    string Email);
