namespace _2026Alumnos.models
{
 public class Docente
{
    public int DocenteId { get; set; }

    public string? NombreCompleto { get; set; } = null!;

    public string? DNI { get; set; }

    public Sexo Sexo { get; set; }

    public string? Email { get; set; } = null!;

    public ICollection<NotaAlumno>? NotaAlumnos { get; set; }
}

public enum Sexo
{
    Masculino,
    Femenino,
    Otro
}   
}
