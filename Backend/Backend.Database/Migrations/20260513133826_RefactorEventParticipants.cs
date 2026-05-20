using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class RefactorEventParticipants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_event_participants",
                table: "event_participants");

            migrationBuilder.DropIndex(
                name: "IX_event_participants_Email",
                table: "event_participants");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "event_participants",
                type: "text",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE event_participants
                SET "UserId" = u."Id"
                FROM "AspNetUsers" AS u
                WHERE LOWER(event_participants."Email") = LOWER(u."Email")
                """);

            migrationBuilder.Sql("""
                DELETE FROM event_participants
                WHERE "UserId" IS NULL
                """);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "event_participants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "Email",
                table: "event_participants");

            migrationBuilder.AddColumn<DateTime?>(
                name: "AcceptedAtUtc",
                table: "event_participants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_event_participants",
                table: "event_participants",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.CreateTable(
                name: "invite_tokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TokenHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    ExpiresAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invite_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invite_tokens_events_EventId",
                        column: x => x.EventId,
                        principalTable: "events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_event_participants_UserId",
                table: "event_participants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_invite_tokens_EventId_Email",
                table: "invite_tokens",
                columns: new[] { "EventId", "Email" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_invite_tokens_TokenHash",
                table: "invite_tokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_event_participants_AspNetUsers_UserId",
                table: "event_participants",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_event_participants_AspNetUsers_UserId",
                table: "event_participants");

            migrationBuilder.DropTable(
                name: "invite_tokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_event_participants",
                table: "event_participants");

            migrationBuilder.DropIndex(
                name: "IX_event_participants_UserId",
                table: "event_participants");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "event_participants");

            migrationBuilder.DropColumn(
                name: "AcceptedAtUtc",
                table: "event_participants");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "event_participants",
                type: "character varying(320)",
                maxLength: 320,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_event_participants",
                table: "event_participants",
                columns: new[] { "EventId", "Email" });

            migrationBuilder.CreateIndex(
                name: "IX_event_participants_Email",
                table: "event_participants",
                column: "Email");
        }
    }
}
