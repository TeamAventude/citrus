using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Session001.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Production");

            migrationBuilder.CreateTable(
                name: "Product",
                schema: "Production",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProductNumber = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    MakeFlag = table.Column<bool>(type: "bit", nullable: false),
                    FinishedGoodsFlag = table.Column<bool>(type: "bit", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    SafetyStockLevel = table.Column<short>(type: "smallint", nullable: false),
                    ReorderPoint = table.Column<short>(type: "smallint", nullable: false),
                    StandardCost = table.Column<decimal>(type: "money", nullable: false),
                    ListPrice = table.Column<decimal>(type: "money", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    SizeUnitMeasureCode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    WeightUnitMeasureCode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    Weight = table.Column<decimal>(type: "decimal(8,2)", nullable: true),
                    DaysToManufacture = table.Column<int>(type: "int", nullable: false),
                    ProductLine = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    Class = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    Style = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    ProductSubcategoryID = table.Column<int>(type: "int", nullable: true),
                    ProductModelID = table.Column<int>(type: "int", nullable: true),
                    SellStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SellEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DiscontinuedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    rowguid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.ProductID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_Name",
                schema: "Production",
                table: "Product",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ProductNumber",
                schema: "Production",
                table: "Product",
                column: "ProductNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Product_rowguid",
                schema: "Production",
                table: "Product",
                column: "rowguid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Product",
                schema: "Production");
        }
    }
}
