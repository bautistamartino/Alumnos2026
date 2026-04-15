using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace models;
public class Asignatura
{
    
    public int Id { get; set; }
    public string? Descripcion { get; set; }
    public bool Eliminado { get; set; }
}