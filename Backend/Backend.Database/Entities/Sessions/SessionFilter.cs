namespace Backend.Database.Entities.Sessions;

public sealed record SessionFilter(
    List<string>? Labels = null,
    bool? AvailableOnly = false
);