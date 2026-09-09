namespace _2026Alumnos.models
{
        public class Asignatura
    {
        public int AsignaturaId { get; set; } 

        public string? Descripcion { get; set; } = null!;

        public int Año { get; set; }
        
        public int CarreraId { get; set; }

        public bool Eliminado { get; set; }

        public virtual Carrera? Carrera { get; set; }
    }
}