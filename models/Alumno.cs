using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace models;
public class Alumno
{
    
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public int Dni    { get; set; }
    public int Nota { get; set; }
}