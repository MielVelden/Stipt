using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class UseLocalDateForEventDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Convert from timestamptz to timestamp without time zone (wall-clock time).
            // AT TIME ZONE 'UTC' strips the timezone, preserving the same wall-clock value.
            migrationBuilder.Sql(
                """
                ALTER TABLE events
                    ALTER COLUMN "StartDate" TYPE timestamp without time zone
                        USING ("StartDate" AT TIME ZONE 'UTC'),
                    ALTER COLUMN "EndDate" TYPE timestamp without time zone
                        USING ("EndDate" AT TIME ZONE 'UTC');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE events
                    ALTER COLUMN "StartDate" TYPE timestamp with time zone
                        USING "StartDate" AT TIME ZONE 'UTC',
                    ALTER COLUMN "EndDate" TYPE timestamp with time zone
                        USING "EndDate" AT TIME ZONE 'UTC';
                """);
        }
    }
}
