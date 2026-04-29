using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2026Alumnos.Migrations
{
    /// <inheritdoc />
    public partial class ModificacionesRelacionesModelos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DocenteId",
                table: "NotaAlumno",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotaAlumno_DocenteId",
                table: "NotaAlumno",
                column: "DocenteId");

            migrationBuilder.AddForeignKey(
                name: "FK_NotaAlumno_Docente_DocenteId",
                table: "NotaAlumno",
                column: "DocenteId",
                principalTable: "Docente",
                principalColumn: "DocenteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NotaAlumno_Docente_DocenteId",
                table: "NotaAlumno");

            migrationBuilder.DropIndex(
                name: "IX_NotaAlumno_DocenteId",
                table: "NotaAlumno");

            migrationBuilder.DropColumn(
                name: "DocenteId",
                table: "NotaAlumno");
        }
    }
}
