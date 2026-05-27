using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2026Alumnos.Migrations
{
    /// <inheritdoc />
    public partial class HistorialAlumnoYDocente_12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_HistorialNotaAlumno",
                table: "HistorialNotaAlumno");

            migrationBuilder.RenameTable(
                name: "HistorialNotaAlumno",
                newName: "HistorialNotaAlumnos");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HistorialNotaAlumnos",
                table: "HistorialNotaAlumnos",
                column: "HistorialNotaAlumnoID");

            migrationBuilder.CreateTable(
                name: "HistorialAlumnos",
                columns: table => new
                {
                    AlumnoHistorialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoID = table.Column<int>(type: "int", nullable: false),
                    FechaCambio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CampoModificado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorAnterior = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorNuevo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialAlumnos", x => x.AlumnoHistorialID);
                });

            migrationBuilder.CreateTable(
                name: "HistorialDocentes",
                columns: table => new
                {
                    DocenteHistorialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocenteID = table.Column<int>(type: "int", nullable: false),
                    FechaCambio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CampoModificado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorAnterior = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorNuevo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialDocentes", x => x.DocenteHistorialID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HistorialAlumnos");

            migrationBuilder.DropTable(
                name: "HistorialDocentes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HistorialNotaAlumnos",
                table: "HistorialNotaAlumnos");

            migrationBuilder.RenameTable(
                name: "HistorialNotaAlumnos",
                newName: "HistorialNotaAlumno");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HistorialNotaAlumno",
                table: "HistorialNotaAlumno",
                column: "HistorialNotaAlumnoID");
        }
    }
}
