namespace _2026Alumnos.models
{
        public class Asignatura
    {
         public int AsignaturaId { get; set; } 

        public string? Descripcion { get; set; } = null!;

        public bool Eliminado { get; set; }
    }
}