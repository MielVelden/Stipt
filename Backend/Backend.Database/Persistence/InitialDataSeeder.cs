using Backend.Database.Entities;
using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;

namespace Backend.Database.Persistence;

internal static class InitialDataSeeder
{
    private const string AttendeeRole = "attendee";
    private const string ManagerRole = "manager";
    private const string ParticipantTestEmail = "delivered@resend.dev";

    private static readonly Guid MainEventId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850001");
    private static readonly Guid MainHallId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850002");
    private static readonly Guid WorkshopARoomId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850003");
    private static readonly Guid WorkshopBRoomId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850004");

    private static readonly Guid TestEventId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850101");
    private static readonly Guid TestRoomAId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850102");
    private static readonly Guid TestRoomBId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850103");
    private static readonly Guid TestRoomCId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850104");

    private static readonly Guid OverlapSessionAId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850111");
    private static readonly Guid OverlapSessionBId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850112");
    private static readonly Guid WaitlistSessionId = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850113");

    public static async Task SeedAsync(ApplicationDbContext dbContext, IConfiguration configuration, CancellationToken cancellationToken = default)
    {
        var userManager = dbContext.GetService<UserManager<ApplicationUser>>();
        var roleManager = dbContext.GetService<RoleManager<IdentityRole>>();

        var seedPassword = configuration["Seeder:SeedUserPassword"];
        if (string.IsNullOrEmpty(seedPassword))
            throw new InvalidOperationException("Seeder:SeedUserPassword is not configured. Set it via user-secrets or environment variables.");

        await EnsureRolesExistsAsync(roleManager);
        var seededUsers = await EnsureSeedAttendeesAsync(userManager, seedPassword);
        await EnsureSeedManagerAsync(userManager, seedPassword);

        await SeedMainEventAsync(dbContext, cancellationToken);
        await SeedTestEventWithEnrollmentsAsync(dbContext, seededUsers, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureRolesExistsAsync(RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync(AttendeeRole))
            await roleManager.CreateAsync(new IdentityRole(AttendeeRole));

        if (!await roleManager.RoleExistsAsync(ManagerRole))
            await roleManager.CreateAsync(new IdentityRole(ManagerRole));
    }

    private static async Task<IReadOnlyDictionary<string, ApplicationUser>> EnsureSeedAttendeesAsync(
        UserManager<ApplicationUser> userManager,
        string seedPassword)
    {
        var userEmails = new List<string> { ParticipantTestEmail };
        userEmails.AddRange(Enumerable.Range(1, 20).Select(i => $"delivered+test{i:00}@resend.dev"));

        var usersByEmail = new Dictionary<string, ApplicationUser>(StringComparer.OrdinalIgnoreCase);

        foreach (var email in userEmails)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = email == ParticipantTestEmail ? "Jan" : "Test",
                    LastName = email == ParticipantTestEmail ? "Jansen" : $"Gebruiker {email.Split('@')[0]}"
                };

                var result = await userManager.CreateAsync(user, seedPassword);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create seed attendee user {email}: {errors}");
                }

                await userManager.AddToRoleAsync(user, AttendeeRole);

                user = await userManager.FindByEmailAsync(email)
                    ?? throw new InvalidOperationException($"Seed user {email} was created but could not be loaded.");
            }

            usersByEmail[email] = user;
        }

        return usersByEmail;
    }


    private static async Task EnsureSeedManagerAsync(UserManager<ApplicationUser> userManager,
        string seedPassword)
    {

        const string managerTestEmail = "manager@test.nl";
        var managerEntity = await userManager.FindByEmailAsync(managerTestEmail);
        if (managerEntity == null)
        {
            var manager = new ApplicationUser
            {
                UserName = managerTestEmail,
                Email = managerTestEmail,
                EmailConfirmed = true,
                FirstName = "Maikel",
                LastName = "de Manager"
            };

            var result = await userManager.CreateAsync(manager, seedPassword);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(manager, ManagerRole);
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create seed manager user: {errors}");
            }
        }
    }

    private static async Task SeedMainEventAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        var mainEventExists = await dbContext.Events.AnyAsync(x => x.Id == MainEventId, cancellationToken);
        if (mainEventExists)
            return;

        dbContext.Events.Add(new Event
        {
            Id = MainEventId,
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
        });

        dbContext.Rooms.AddRange(
            new Room
            {
                Id = MainHallId,
                Name = "Main Hall",
                Capacity = 180,
                EventId = MainEventId
            },
            new Room
            {
                Id = WorkshopARoomId,
                Name = "Workshop Room A",
                Capacity = 60,
                EventId = MainEventId
            },
            new Room
            {
                Id = WorkshopBRoomId,
                Name = "Workshop Room B",
                Capacity = 60,
                EventId = MainEventId
            });

        dbContext.Sessions.AddRange(
            new Session
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850011"),
                Title = "Keynote: Building Reliable APIs",
                Description = "Patterns and trade-offs for resilient web APIs.",
                Type = SessionType.Keynote,
                Speaker = "Ava Thompson",
                RoomId = MainHallId,
                EventId = MainEventId,
                StartDateTime = new DateTime(2026, 4, 20, 9, 0, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 10, 0, 0, DateTimeKind.Utc),
                Capacity = 180,
                Labels = ["keynote", "architecture"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 5, 0, DateTimeKind.Utc)
            },
            new Session
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850012"),
                Title = "Hands-on: EF Core 10",
                Description = "Practical modeling, performance, and migrations.",
                Type = SessionType.Breakout,
                Speaker = "Liam Carter",
                RoomId = WorkshopARoomId,
                EventId = MainEventId,
                StartDateTime = new DateTime(2026, 4, 20, 10, 30, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 11, 30, 0, DateTimeKind.Utc),
                Capacity = 60,
                Labels = ["dotnet", "database"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 10, 0, DateTimeKind.Utc)
            },
            new Session
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850013"),
                Title = "Workshop: React Router in Production",
                Description = "Routing and data APIs for complex frontends.",
                Type = SessionType.Breakout,
                Speaker = "Noah de Vries",
                RoomId = WorkshopBRoomId,
                EventId = MainEventId,
                StartDateTime = new DateTime(2026, 4, 20, 13, 30, 0, DateTimeKind.Utc),
                EndDateTime = new DateTime(2026, 4, 20, 14, 30, 0, DateTimeKind.Utc),
                Capacity = 60,
                Labels = ["frontend", "react"],
                CreatedAtUtc = new DateTime(2026, 3, 20, 12, 15, 0, DateTimeKind.Utc)
            });
    }

    private static async Task SeedTestEventWithEnrollmentsAsync(
        ApplicationDbContext dbContext,
        IReadOnlyDictionary<string, ApplicationUser> seededUsers,
        CancellationToken cancellationToken)
    {
        var testEventExists = await dbContext.Events.AnyAsync(x => x.Id == TestEventId, cancellationToken);
        if (!testEventExists)
        {
            dbContext.Events.Add(new Event
            {
                Id = TestEventId,
                Name = "Stipt Test Event 2026",
                Location = "Den Bosch - Testlocatie",
                StartDate = new DateTime(2026, 5, 15, 8, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 5, 15, 18, 0, 0, DateTimeKind.Utc),
                Style = new EventStyle
                {
                    PrimaryBackgroundColor = "#0F172A",
                    PrimaryForegroundColor = "#E2E8F0",
                    LogoImageUrl = null
                },
                IsArchived = false,
                CreatedAtUtc = new DateTime(2026, 4, 1, 9, 0, 0, DateTimeKind.Utc)
            });

            dbContext.Rooms.AddRange(
                new Room
                {
                    Id = TestRoomAId,
                    Name = "Test Room A",
                    Capacity = 30,
                    EventId = TestEventId
                },
                new Room
                {
                    Id = TestRoomBId,
                    Name = "Test Room B",
                    Capacity = 30,
                    EventId = TestEventId
                },
                new Room
                {
                    Id = TestRoomCId,
                    Name = "Test Room C",
                    Capacity = 20,
                    EventId = TestEventId
                });

            dbContext.Sessions.AddRange(
                new Session
                {
                    Id = OverlapSessionAId,
                    Title = "Test Overlap Session A",
                    Description = "Overlaps with session B for conflict and replacement tests.",
                    Type = SessionType.Breakout,
                    Speaker = "Seed Speaker A",
                    RoomId = TestRoomAId,
                    EventId = TestEventId,
                    StartDateTime = new DateTime(2026, 5, 15, 10, 0, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2026, 5, 15, 11, 0, 0, DateTimeKind.Utc),
                    Capacity = 4,
                    Labels = ["test", "overlap"],
                    CreatedAtUtc = new DateTime(2026, 4, 1, 9, 5, 0, DateTimeKind.Utc)
                },
                new Session
                {
                    Id = OverlapSessionBId,
                    Title = "Test Overlap Session B",
                    Description = "Overlaps with session A for conflict and replacement tests.",
                    Type = SessionType.Breakout,
                    Speaker = "Seed Speaker B",
                    RoomId = TestRoomBId,
                    EventId = TestEventId,
                    StartDateTime = new DateTime(2026, 5, 15, 10, 30, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2026, 5, 15, 11, 30, 0, DateTimeKind.Utc),
                    Capacity = 4,
                    Labels = ["test", "overlap"],
                    CreatedAtUtc = new DateTime(2026, 4, 1, 9, 6, 0, DateTimeKind.Utc)
                },
                new Session
                {
                    Id = WaitlistSessionId,
                    Title = "Test Waitlist Session",
                    Description = "Session with full capacity and waiting list entries.",
                    Type = SessionType.Breakout,
                    Speaker = "Seed Speaker C",
                    RoomId = TestRoomCId,
                    EventId = TestEventId,
                    StartDateTime = new DateTime(2026, 5, 15, 12, 0, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2026, 5, 15, 13, 0, 0, DateTimeKind.Utc),
                    Capacity = 2,
                    Labels = ["test", "waitlist"],
                    CreatedAtUtc = new DateTime(2026, 4, 1, 9, 7, 0, DateTimeKind.Utc)
                });
        }

        var testSessionIds = new[] { OverlapSessionAId, OverlapSessionBId, WaitlistSessionId };
        var hasTestEnrollments = await dbContext.SessionEnrollments.AnyAsync(x => testSessionIds.Contains(x.SessionId), cancellationToken);
        if (hasTestEnrollments)
            return;

        var defaultUser = seededUsers[ParticipantTestEmail];
        var extraUsers = seededUsers
            .Where(x => !x.Key.Equals(ParticipantTestEmail, StringComparison.OrdinalIgnoreCase))
            .Take(6)
            .Select(x => x.Value)
            .ToList();

        if (extraUsers.Count < 6)
            throw new InvalidOperationException("Not enough seeded users were available to create test enrollments.");

        var overlapAUser1 = ParseParticipantId(extraUsers[0]);
        var overlapAUser2 = ParseParticipantId(extraUsers[1]);
        var overlapBUser1 = ParseParticipantId(extraUsers[2]);
        var overlapBUser2 = ParseParticipantId(extraUsers[3]);
        var waitlistEnrolledUser1 = ParseParticipantId(extraUsers[4]);
        var waitlistEnrolledUser2 = ParseParticipantId(extraUsers[5]);
        var defaultParticipantId = ParseParticipantId(defaultUser);

        dbContext.SessionEnrollments.AddRange(
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850201"),
                SessionId = OverlapSessionAId,
                ParticipantId = overlapAUser1,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 0, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850202"),
                SessionId = OverlapSessionAId,
                ParticipantId = overlapAUser2,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 1, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850203"),
                SessionId = OverlapSessionBId,
                ParticipantId = overlapBUser1,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 2, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850204"),
                SessionId = OverlapSessionBId,
                ParticipantId = overlapBUser2,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 3, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850205"),
                SessionId = WaitlistSessionId,
                ParticipantId = waitlistEnrolledUser1,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 4, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850206"),
                SessionId = WaitlistSessionId,
                ParticipantId = waitlistEnrolledUser2,
                Status = SessionEnrollmentStatus.Enrolled,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 5, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850207"),
                SessionId = WaitlistSessionId,
                ParticipantId = defaultParticipantId,
                Status = SessionEnrollmentStatus.Waitlisted,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 6, 0, DateTimeKind.Utc)
            },
            new SessionEnrollment
            {
                Id = Guid.Parse("f1f32d97-4a28-47fd-bf3c-c7b90c850208"),
                SessionId = WaitlistSessionId,
                ParticipantId = overlapAUser1,
                Status = SessionEnrollmentStatus.Waitlisted,
                CreatedAtUtc = new DateTime(2026, 4, 10, 8, 7, 0, DateTimeKind.Utc)
            });
    }

    private static Guid ParseParticipantId(ApplicationUser user)
    {
        if (!Guid.TryParse(user.Id, out var participantId))
            throw new InvalidOperationException($"Seed user id '{user.Id}' for '{user.Email}' is not a valid Guid.");

        return participantId;
    }
}

