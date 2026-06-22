using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class UseLocalDateTimeForSessionSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Convert from timestamptz to timestamp (wall-clock time).
            // AT TIME ZONE 'UTC' extracts the UTC component as a local timestamp,
            // preserving the numeric value the user originally typed.
            migrationBuilder.Sql(
                """
                ALTER TABLE sessions
                    ALTER COLUMN "StartDateTime" TYPE timestamp without time zone
                        USING "StartDateTime" AT TIME ZONE 'UTC',
                    ALTER COLUMN "EndDateTime" TYPE timestamp without time zone
                        USING "EndDateTime" AT TIME ZONE 'UTC';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE sessions
                    ALTER COLUMN "StartDateTime" TYPE timestamp with time zone
                        USING "StartDateTime" AT TIME ZONE 'UTC',
                    ALTER COLUMN "EndDateTime" TYPE timestamp with time zone
                        USING "EndDateTime" AT TIME ZONE 'UTC';
                """);
        }
    }
}
