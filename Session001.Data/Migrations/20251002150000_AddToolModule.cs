using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Session001.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddToolModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tool",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ToolNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProcurementPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProcurementDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentStatus = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, defaultValue: "Available"),
                    IsUsable = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    TotalRepairCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    TotalRepairCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TotalBorrowCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OverdueCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LastBorrowedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "getdate()"),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "getdate()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tool", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ToolHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ToolId = table.Column<int>(type: "int", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProjectNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PurchaseOrderNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    QCPassed = table.Column<bool>(type: "bit", nullable: true),
                    RepairPassed = table.Column<bool>(type: "bit", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsOverdue = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "getdate()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToolHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToolHistory_Tool_ToolId",
                        column: x => x.ToolId,
                        principalTable: "Tool",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tool_Name",
                table: "Tool",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Tool_ToolNumber",
                table: "Tool",
                column: "ToolNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ToolHistory_EventDate",
                table: "ToolHistory",
                column: "EventDate");

            migrationBuilder.CreateIndex(
                name: "IX_ToolHistory_EventType",
                table: "ToolHistory",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_ToolHistory_ToolId_EventType_EventDate",
                table: "ToolHistory",
                columns: new[] { "ToolId", "EventType", "EventDate" });

            migrationBuilder.CreateIndex(
                name: "IX_ToolHistory_UserId",
                table: "ToolHistory",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ToolHistory");

            migrationBuilder.DropTable(
                name: "Tool");
        }
    }
}
