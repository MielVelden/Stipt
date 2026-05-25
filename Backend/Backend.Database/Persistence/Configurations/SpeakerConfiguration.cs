using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.Speakers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Database.Persistence.Configurations;

internal sealed class SpeakerConfiguration : IEntityTypeConfiguration<Speaker>
{
    public void Configure(EntityTypeBuilder<Speaker> builder)
    {
        builder.ToTable("speakers");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Title)
            .HasMaxLength(200);

        builder.Property(x => x.Company)
            .HasMaxLength(200);

        builder.Property(x => x.Bio)
            .HasMaxLength(4000);

        builder.Property(x => x.EventId)
            .IsRequired();

        builder.Property(x => x.PhotoId);

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.Property(x => x.UpdatedAtUtc);

        builder.HasOne(x => x.Photo)
            .WithMany()
            .HasForeignKey(x => x.PhotoId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Event)
            .WithMany(e => e.Speakers)
            .HasForeignKey(x => x.EventId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Sessions)
            .WithMany(x => x.Speakers)
            .UsingEntity<Dictionary<string, object>>(
                "session_speakers",
                j => j.HasOne<Session>()
                    .WithMany()
                    .HasForeignKey("SessionId")
                    .OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<Speaker>()
                    .WithMany()
                    .HasForeignKey("SpeakerId")
                    .OnDelete(DeleteBehavior.Cascade));

        builder.HasIndex(x => x.EventId);
        builder.HasIndex(x => x.CreatedAtUtc);
    }
}
