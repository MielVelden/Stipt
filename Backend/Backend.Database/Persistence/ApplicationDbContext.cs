using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<SessionEnrollment> SessionEnrollments => Set<SessionEnrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
