using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class UseImageIdForEventLogo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE events
                    DROP COLUMN IF EXISTS style_logo_image_url,
                    ADD COLUMN style_logo_image_id uuid REFERENCES images("Id") ON DELETE SET NULL;
                """);

            migrationBuilder.Sql(
                """
                CREATE INDEX IF NOT EXISTS "IX_events_style_logo_image_id" ON events (style_logo_image_id);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP INDEX IF EXISTS "IX_events_style_logo_image_id";
                ALTER TABLE events
                    DROP COLUMN IF EXISTS style_logo_image_id,
                    ADD COLUMN style_logo_image_url character varying(2000);
                """);
        }
    }
}
