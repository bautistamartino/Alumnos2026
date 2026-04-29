using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2026Alumnos.Migrations
{
    /// <inheritdoc />
    public partial class AgregarFechaNota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha",
                table: "NotaAlumno",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fecha",
                table: "NotaAlumno");
        }
    }
}
