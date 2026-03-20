using Backend.Domain.Events;
using Backend.Domain.Todos;
using Backend.Domain.Rooms;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos => Set<TodoItem>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Event> Events => Set<Event>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
