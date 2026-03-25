using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Persistence;

internal static class InitialDataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.Events.AnyAsync(cancellationToken))
        {
            return;
        }

        dbContext.Events.Add(new Event
        {
            Id = Guid.NewGuid(),
            Name = "Stipt Summit 2026",
            Location = "'s-Hertogenbosch, Onderwijsboulevard",
            StartDate = new DateTimeOffset(2026, 4, 20, 8, 0, 0, TimeSpan.Zero),
            EndDate = new DateTimeOffset(2026, 4, 20, 18, 0, 0, TimeSpan.Zero),
            Style = new EventStyle
            {
                PrimaryBackgroundColor = "#111827",
                PrimaryForegroundColor = "#F9FAFB",
                LogoImageUrl = null
            },
            IsArchived = false,
            CreatedAtUtc = new DateTime(2026, 3, 20, 12, 0, 0, DateTimeKind.Utc)
        });

        dbContext.Rooms.AddRange(
            new Room
            {
                Id = Guid.NewGuid(),
                Name = "Main Hall",
                Capacity = 180
            },
            new Room
            {
                Id = Guid.NewGuid(),
                Name = "Workshop Room A",
                Capacity = 60
            },
            new Room
            {
                Id = Guid.NewGuid(),
                Name = "Workshop Room B",
                Capacity = 60
        });

        dbContext.Sessions.AddRange(
            new Session
            {
                Id = Guid.NewGuid(),
                Title = "Keynote: Building Reliable APIs",
                Description = "Patterns and trade-offs for resilient web APIs.",
                Speaker = "Ava Thompson",
                Room = "Main Hall",
                StartTime = new DateTimeOffset(2026, 4, 20, 9, 0, 0, TimeSpan.Zero),
                EndTime = new DateTimeOffset(2026, 4, 20, 10, 0, 0, TimeSpan.Zero),
                Capacity = 180,
                Labels = ["keynote", "architecture"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 5, 0, DateTimeKind.Utc)
            },
            new Session
            {
                Id = Guid.NewGuid(),
                Title = "Hands-on: EF Core 10",
                Description = "Practical modeling, performance, and migrations.",
                Speaker = "Liam Carter",
                Room = "Workshop Room A",
                StartTime = new DateTimeOffset(2026, 4, 20, 10, 30, 0, TimeSpan.Zero),
                EndTime = new DateTimeOffset(2026, 4, 20, 11, 30, 0, TimeSpan.Zero),
                Capacity = 60,
                Labels = ["dotnet", "database"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 10, 0, DateTimeKind.Utc)
            },
            new Session
            {
                Id = Guid.NewGuid(),
                Title = "Workshop: React Router in Production",
                Description = "Routing and data APIs for complex frontends.",
                Speaker = "Noah de Vries",
                Room = "Workshop Room B",
                StartTime = new DateTimeOffset(2026, 4, 20, 13, 30, 0, TimeSpan.Zero),
                EndTime = new DateTimeOffset(2026, 4, 20, 14, 30, 0, TimeSpan.Zero),
                Capacity = 60,
                Labels = ["frontend", "react"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 15, 0, DateTimeKind.Utc)
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

