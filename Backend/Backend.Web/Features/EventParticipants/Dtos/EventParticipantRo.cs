using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.EventParticipants.Dtos;

[ExportTsInterface]
public sealed record EventParticipantRo(
    Guid EventId,
    string Email,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? AcceptedAtUtc = null);
