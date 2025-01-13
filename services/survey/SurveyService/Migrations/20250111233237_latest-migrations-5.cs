using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SurveyService.Migrations
{
    /// <inheritdoc />
    public partial class latestmigrations5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EditBy",
                table: "FileEntitys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EditedDate",
                table: "FileEntitys",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EditBy",
                table: "FileEntitys");

            migrationBuilder.DropColumn(
                name: "EditedDate",
                table: "FileEntitys");
        }
    }
}
