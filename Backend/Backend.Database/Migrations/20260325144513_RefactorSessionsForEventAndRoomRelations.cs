using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class RefactorSessionsForEventAndRoomRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM sessions) THEN
                        RAISE EXCEPTION 'Migration RefactorSessionsForEventAndRoomRelations requires empty sessions table. Existing session data must be migrated manually first.';
                    END IF;
                END $$;
                """);

            migrationBuilder.DropIndex(
                name: "IX_sessions_Room",
                table: "sessions");

            migrationBuilder.DropColumn(
                name: "Room",
                table: "sessions");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "sessions",
                newName: "StartDateTime");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "sessions",
                newName: "EndDateTime");

            migrationBuilder.RenameIndex(
                name: "IX_sessions_StartTime",
                table: "sessions",
                newName: "IX_sessions_StartDateTime");

            migrationBuilder.AddColumn<Guid>(
                name: "EventId",
                table: "sessions",
                type: "uuid",
                nullable: false);

            migrationBuilder.AddColumn<Guid>(
                name: "RoomId",
                table: "sessions",
                type: "uuid",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "sessions",
                type: "text",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_sessions_EventId",
                table: "sessions",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_sessions_RoomId",
                table: "sessions",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_sessions_events_EventId",
                table: "sessions",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_sessions_rooms_RoomId",
                table: "sessions",
                column: "RoomId",
                principalTable: "rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_sessions_events_EventId",
                table: "sessions");

            migrationBuilder.DropForeignKey(
                name: "FK_sessions_rooms_RoomId",
                table: "sessions");

            migrationBuilder.DropIndex(
                name: "IX_sessions_EventId",
                table: "sessions");

            migrationBuilder.DropIndex(
                name: "IX_sessions_RoomId",
                table: "sessions");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "sessions");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "sessions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "sessions");

            migrationBuilder.RenameColumn(
                name: "StartDateTime",
                table: "sessions",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "EndDateTime",
                table: "sessions",
                newName: "EndTime");

            migrationBuilder.RenameIndex(
                name: "IX_sessions_StartDateTime",
                table: "sessions",
                newName: "IX_sessions_StartTime");

            migrationBuilder.AddColumn<string>(
                name: "Room",
                table: "sessions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_sessions_Room",
                table: "sessions",
                column: "Room");
        }
    }
}
