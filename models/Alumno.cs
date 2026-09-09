using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace _2026Alumnos.models
{
    public class Alumno
    {
        [JsonPropertyName("alumnoId")]
        public int AlumnoId { get; set; }

        [JsonPropertyName("nombreCompleto")]
        public string? NombreCompleto { get; set; } = null!;

        [JsonPropertyName("dni")]
        public string? DNI { get; set; }

        [JsonPropertyName("sexo")]
        public Sexo Sexo { get; set; }

        [JsonPropertyName("domicilio")]
        public string? Domicilio { get; set; } = null!;

        [JsonPropertyName("email")]
        public string? Email { get; set; } = null!;

        [JsonIgnore]
        public ICollection<NotaAlumno>? Notas { get; set; }
    }

}