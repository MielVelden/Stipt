using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSpeakers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Speaker",
                table: "sessions");

            migrationBuilder.CreateTable(
                name: "speakers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Company = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Bio = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    PhotoId = table.Column<Guid>(type: "uuid", nullable: true),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_speakers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_speakers_events_EventId",
                        column: x => x.EventId,
                        principalTable: "events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_speakers_images_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "images",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "session_speakers",
                columns: table => new
                {
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    SpeakerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_session_speakers", x => new { x.SessionId, x.SpeakerId });
                    table.ForeignKey(
                        name: "FK_session_speakers_sessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_session_speakers_speakers_SpeakerId",
                        column: x => x.SpeakerId,
                        principalTable: "speakers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_session_speakers_SpeakerId",
                table: "session_speakers",
                column: "SpeakerId");

            migrationBuilder.CreateIndex(
                name: "IX_speakers_CreatedAtUtc",
                table: "speakers",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_speakers_EventId",
                table: "speakers",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_speakers_PhotoId",
                table: "speakers",
                column: "PhotoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "session_speakers");

            migrationBuilder.DropTable(
                name: "speakers");

            migrationBuilder.AddColumn<string>(
                name: "Speaker",
                table: "sessions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
