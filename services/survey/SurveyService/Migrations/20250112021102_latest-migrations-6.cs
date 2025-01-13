using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SurveyService.Migrations
{
    /// <inheritdoc />
    public partial class latestmigrations6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChangesMade",
                table: "FileEntitys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReasonChanges",
                table: "FileEntitys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangesMade",
                table: "FileEntitys");

            migrationBuilder.DropColumn(
                name: "ReasonChanges",
                table: "FileEntitys");
        }
    }
}
