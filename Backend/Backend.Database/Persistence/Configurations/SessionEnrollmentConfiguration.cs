using Backend.Database.Entities.Sessions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Database.Persistence.Configurations;

internal sealed class SessionEnrollmentConfiguration : IEntityTypeConfiguration<SessionEnrollment>
{
    public void Configure(EntityTypeBuilder<SessionEnrollment> builder)
    {
        builder.ToTable("session_enrollments");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();

        builder.Property(x => x.SessionId)
            .IsRequired();

        builder.Property(x => x.ParticipantId)
            .IsRequired();

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.Property(x => x.UpdatedAtUtc);

        builder.HasOne(x => x.Session)
            .WithMany(x => x.Enrollments)
            .HasForeignKey(x => x.SessionId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.SessionId, x.ParticipantId })
            .IsUnique();
        builder.HasIndex(x => new { x.SessionId, x.Status, x.CreatedAtUtc });
        builder.HasIndex(x => new { x.ParticipantId, x.Status });
    }
}

