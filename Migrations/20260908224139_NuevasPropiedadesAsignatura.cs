using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2026Alumnos.Migrations
{
    /// <inheritdoc />
    public partial class NuevasPropiedadesAsignatura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Año",
                table: "Asignaturas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CarreraId",
                table: "Asignaturas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Asignaturas_CarreraId",
                table: "Asignaturas",
                column: "CarreraId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asignaturas_Carreras_CarreraId",
                table: "Asignaturas",
                column: "CarreraId",
                principalTable: "Carreras",
                principalColumn: "CarreraId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asignaturas_Carreras_CarreraId",
                table: "Asignaturas");

            migrationBuilder.DropIndex(
                name: "IX_Asignaturas_CarreraId",
                table: "Asignaturas");

            migrationBuilder.DropColumn(
                name: "Año",
                table: "Asignaturas");

            migrationBuilder.DropColumn(
                name: "CarreraId",
                table: "Asignaturas");
        }
    }
}
