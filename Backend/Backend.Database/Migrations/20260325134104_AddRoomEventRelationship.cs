using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomEventRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EventId",
                table: "rooms",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_rooms_EventId",
                table: "rooms",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_rooms_events_EventId",
                table: "rooms",
                column: "EventId",
                principalTable: "events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rooms_events_EventId",
                table: "rooms");

            migrationBuilder.DropIndex(
                name: "IX_rooms_EventId",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "rooms");
        }
    }
}
