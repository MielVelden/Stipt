using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueSessionAttendanceIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_session_attendances_SessionId",
                table: "session_attendances");

            migrationBuilder.CreateIndex(
                name: "IX_session_attendances_SessionId_ParticipantId",
                table: "session_attendances",
                columns: new[] { "SessionId", "ParticipantId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_session_attendances_SessionId_ParticipantId",
                table: "session_attendances");

            migrationBuilder.CreateIndex(
                name: "IX_session_attendances_SessionId",
                table: "session_attendances",
                column: "SessionId");
        }
    }
}
