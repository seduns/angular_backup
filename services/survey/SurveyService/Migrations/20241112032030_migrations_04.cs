using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SurveyService.Migrations
{
    /// <inheritdoc />
    public partial class migrations_04 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductSelection",
                table: "surveyItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductSelection",
                table: "surveyItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
