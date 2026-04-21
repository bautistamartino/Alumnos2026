public class Docente
{
    public int DocenteId { get; set; }

    public string NombreCompleto { get; set; } = null!;

    public int DNI { get; set; }

    public Sexo Sexo { get; set; }
}

public enum Sexo
{
    Masculino,
    Femenino,
    Otro
}