using Backend.Database.Entities.Events;
using Backend.Database.Entities.Images;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Database.Persistence.Configurations;

internal sealed class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("events");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Location)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.StartDate)
            .IsRequired();

        builder.Property(x => x.EndDate)
            .IsRequired();

        builder.OwnsOne(x => x.Style, styleBuilder =>
        {
            styleBuilder.Property(s => s.PrimaryBackgroundColor)
                .IsRequired()
                .HasMaxLength(7)
                .HasColumnName("style_primary_background_color");

            styleBuilder.Property(s => s.PrimaryForegroundColor)
                .IsRequired()
                .HasMaxLength(7)
                .HasColumnName("style_primary_foreground_color");

            styleBuilder.Property(s => s.LogoImageId)
                .HasColumnName("style_logo_image_id");

            styleBuilder.HasOne(s => s.LogoImage)
                .WithMany()
                .HasForeignKey(s => s.LogoImageId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Property(x => x.IsArchived)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.Property(x => x.UpdatedAtUtc);

        builder.HasIndex(x => x.StartDate);
        builder.HasIndex(x => x.CreatedAtUtc);
    }
}
