using Microsoft.EntityFrameworkCore.Metadata.Internal;
 
namespace _2026Alumnos.ClasesVistas
{
    public class PromedioNotaAsignatura
    {
        public int AsignaturaId {get; set;}

        public string? NombreAsignatura {get; set;}

        public decimal promedioAsignatura {get; set;}

    }

    
}