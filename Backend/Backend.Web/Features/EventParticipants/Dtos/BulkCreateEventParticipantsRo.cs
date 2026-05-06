using TypeGen.Core.TypeAnnotations;

namespace Backend.Web.Features.EventParticipants.Dtos;

[ExportTsInterface]
public sealed record BulkCreateEventParticipantsRo(
    int TotalRows,
    int DuplicatesInFile,
    int DuplicatesInDatabase,
    int SuccessfullyAdded);
