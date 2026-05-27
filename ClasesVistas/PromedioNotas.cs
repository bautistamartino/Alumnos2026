using Microsoft.EntityFrameworkCore.Metadata.Internal;
 
namespace _2026Alumnos.ClasesVistas
{
    public class VistaNotaAlumno
    {
        public int NotaAlumnoID { get; set; }
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public int AsignaturaID { get; set; }

        public string? AsignaturaNombre { get; set; }
        public string? FechaString {get;set;}
         public string? FechaStringInput {get;set;}
        public int Nota { get; set; }
        public int DNI { get; set; }
    }
    
    public class VistaPromedioAlumno
    {
        public int AlumnoID { get; set; }
        public string? NombreCompleto { get; set; }
        public decimal Promedio { get; set; }  
        public string? DNI {get; set; }  
        // public string? SexoString {get; set;}   
        // public string? Domicilio {get;set;}
    }


     public class VistaPromedioAsignatura
    {
        public int AsignaturaID { get; set; }
        public string? AsignaturaNombre { get; set; }
        public decimal Promedio { get; set; }  
    }
}