using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace models;
public class NotaAlumno
{
    
    public int Id { get; set; }
    public string? Nombre { get; set; }


 [Range(10000000, 99999999, ErrorMessage = "El DNI debe tener 8 números")]
    public int Dni { get; set; }

[Range(1, 10, ErrorMessage = "La nota debe estar entre 1 y 10")]
    public int Nota { get; set; }
}