using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace _2026Alumnos.models
{
    public class Alumno
    {
        public int AlumnoId { get; set; }

        public string? NombreCompleto { get; set; } = null!;

        public string? DNI { get; set; }   

        public Sexo Sexo { get; set; }

        public string? Domicilio { get; set; } = null!;

          public string? Email { get; set; } = null!;

        [JsonIgnore] 
        public ICollection<NotaAlumno>? Notas { get; set; }
    }

}