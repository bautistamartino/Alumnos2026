using System.Text.Json.Serialization;


public class Alumno
{
    public int AlumnoId { get; set; }

    public string NombreCompleto { get; set; } = null!;

    public string? DNI { get; set; }   

    public Sexo Sexo { get; set; }

    public string Domicilio { get; set; } = null!;

    [JsonIgnore] 
    public ICollection<NotaAlumno>? Notas { get; set; }
}

