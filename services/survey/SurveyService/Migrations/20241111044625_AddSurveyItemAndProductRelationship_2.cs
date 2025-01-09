using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SurveyService.Migrations
{
    /// <inheritdoc />
    public partial class AddSurveyItemAndProductRelationship_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AllProducts",
                columns: table => new
                {
                    prodId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    serviceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    productName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllProducts", x => x.prodId);
                });

            migrationBuilder.CreateTable(
                name: "surveyItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubmissionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FinancingType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductSelection = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StarRating = table.Column<int>(type: "int", nullable: false),
                    prodId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_surveyItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_surveyItems_AllProducts_prodId",
                        column: x => x.prodId,
                        principalTable: "AllProducts",
                        principalColumn: "prodId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_surveyItems_prodId",
                table: "surveyItems",
                column: "prodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "surveyItems");

            migrationBuilder.DropTable(
                name: "AllProducts");
        }
    }
}
