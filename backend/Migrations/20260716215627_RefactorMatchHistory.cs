using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RefactorMatchHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MatchHistories_Users_WinnerId",
                table: "MatchHistories");

            migrationBuilder.DropIndex(
                name: "IX_MatchHistories_WinnerId",
                table: "MatchHistories");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "MatchHistories");

            migrationBuilder.DropColumn(
                name: "WinnerId",
                table: "MatchHistories");

            migrationBuilder.AddColumn<int>(
                name: "Player1Score",
                table: "MatchHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2Score",
                table: "MatchHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Player1Score",
                table: "MatchHistories");

            migrationBuilder.DropColumn(
                name: "Player2Score",
                table: "MatchHistories");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "MatchHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WinnerId",
                table: "MatchHistories",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MatchHistories_WinnerId",
                table: "MatchHistories",
                column: "WinnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_MatchHistories_Users_WinnerId",
                table: "MatchHistories",
                column: "WinnerId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
