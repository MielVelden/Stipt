using Backend.Database.Entities;
using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Database.Persistence;

internal static class InitialDataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext dbContext, IConfiguration configuration, CancellationToken cancellationToken = default)
    {
        var userManager = dbContext.GetService<UserManager<ApplicationUser>>();
        var roleManager = dbContext.GetService<RoleManager<IdentityRole>>();

        const string participantRole = "deelnemer";
        if (!await roleManager.RoleExistsAsync(participantRole))
        {
            await roleManager.CreateAsync(new IdentityRole(participantRole));
        }

        const string participantTestEmail = "deelnemer@test.nl";
        if (await userManager.FindByEmailAsync(participantTestEmail) == null)
        {
            var seedPassword = configuration["Seeder:SeedUserPassword"];
            if (string.IsNullOrEmpty(seedPassword))
                throw new InvalidOperationException("Seeder:SeedUserPassword is not configured. Set it via user-secrets or environment variables.");

            var user = new ApplicationUser
            {
                UserName = participantTestEmail,
                Email = participantTestEmail,
                EmailConfirmed = true,
                FirstName = "Jan",
                LastName = "Jansen"
            };

            var result = await userManager.CreateAsync(user, seedPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, participantRole);
            }
        }

        if (await dbContext.Events.AnyAsync(cancellationToken))
        {
            return;
        }

        var eventId = Guid.NewGuid();
        var mainHallId = Guid.NewGuid();
        var workshopARoomId = Guid.NewGuid();
        var workshopBRoomId = Guid.NewGuid();

        var eventEntity = new Event
        {
            Id = eventId,
            Name = "Stipt Summit 2026",
            Location = "'s-Hertogenbosch, Onderwijsboulevard",
            StartDate = new DateTime(2026, 4, 20, 8, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2026, 4, 30, 18, 0, 0, DateTimeKind.Utc),
            Style = new EventStyle
            {
                PrimaryBackgroundColor = "#111827",
                PrimaryForegroundColor = "#F9FAFB",
                LogoImageUrl = null
            },
            IsArchived = false,
            CreatedAtUtc = new DateTime(2026, 3, 20, 12, 0, 0, DateTimeKind.Utc)
        };

        dbContext.Events.Add(eventEntity);

        var rooms = new List<Room>
        {
            new() {
                Id = mainHallId,
                Name = "Main Hall",
                Capacity = 180,
                EventId = eventId
            },
            new() {
                Id = workshopARoomId,
                Name = "Workshop Room A",
                Capacity = 60,
                EventId = eventId
            },
            new() {
                Id = workshopBRoomId,
                Name = "Workshop Room B",
                Capacity = 60,
                EventId = eventId
            }
        };

        dbContext.Rooms.AddRange(rooms);

        var sessions = new List<Session>
        {
            new() {
                Id = Guid.NewGuid(),
                Title = "Keynote: Building Reliable APIs",
                Description = "Patterns and trade-offs for resilient web APIs.",
                Type = SessionType.Keynote,
                Speaker = "Ava Thompson",
                RoomId = mainHallId,
                EventId = eventId,
                StartDateTime = new DateTime(2026, 4, 20, 9, 0, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 10, 0, 0, DateTimeKind.Utc),
                Capacity = 180,
                Labels = ["keynote", "architecture"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 5, 0, DateTimeKind.Utc)
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Hands-on: EF Core 10",
                Description = "Practical modeling, performance, and migrations.",
                Type = SessionType.Breakout,
                Speaker = "Liam Carter",
                RoomId = workshopARoomId,
                EventId = eventId,
                StartDateTime = new DateTime(2026, 4, 20, 10, 30, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 11, 30, 0, DateTimeKind.Utc),
                Capacity = 60,
                Labels = ["dotnet", "database"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 10, 0, DateTimeKind.Utc)
            },
            new() {
                Id = Guid.NewGuid(),
                Title = "Workshop: React Router in Production",
                Description = "Routing and data APIs for complex frontends.",
                Type = SessionType.Breakout,
                Speaker = "Noah de Vries",
                RoomId = workshopBRoomId,
                EventId = eventId,
                StartDateTime = new DateTime(2026, 4, 20, 13, 30, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 14, 30, 0, DateTimeKind.Utc),
                Capacity = 60,
                Labels = ["frontend", "react"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 15, 0, DateTimeKind.Utc)
            }
        };

        dbContext.Sessions.AddRange(sessions);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

