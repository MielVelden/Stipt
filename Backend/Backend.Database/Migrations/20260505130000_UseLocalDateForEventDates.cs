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
            // Convert from timestamptz to date (wall-clock date at the venue).
            // AT TIME ZONE 'UTC' extracts the UTC date component, preserving
            // the calendar date that was originally stored.
            migrationBuilder.Sql(
                """
                ALTER TABLE events
                    ALTER COLUMN "StartDate" TYPE date
                        USING ("StartDate" AT TIME ZONE 'UTC')::date,
                    ALTER COLUMN "EndDate" TYPE date
                        USING ("EndDate" AT TIME ZONE 'UTC')::date;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE events
                    ALTER COLUMN "StartDate" TYPE timestamp with time zone
                        USING "StartDate"::timestamp with time zone,
                    ALTER COLUMN "EndDate" TYPE timestamp with time zone
                        USING "EndDate"::timestamp with time zone;
                """);
        }
    }
}
