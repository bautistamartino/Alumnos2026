using Microsoft.EntityFrameworkCore.Metadata.Internal;
 
namespace _2026Alumnos.ClasesVistas
{
    public class PromedioNotaAlumno
    {
        public int AlumnoId {get; set;}

        public string? NombreCompleto {get; set;}

        public decimal promedio {get; set;}

        public int DNI {get; set;}
    }

    
}