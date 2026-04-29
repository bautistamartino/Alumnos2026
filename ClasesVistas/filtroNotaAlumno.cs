using Microsoft.EntityFrameworkCore.Metadata.Internal;
 
namespace _2026Alumnos.ClasesVistas
{
    public class FiltroNotaAlumno
    {
        public string? FechaDesde {get; set;}

        public string? FechaHasta {get; set;}

        public int? AsignaturaID {get; set;}
        
        public int? AlumnoID {get; set;}
    }

    
}