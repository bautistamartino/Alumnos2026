namespace _2026Alumnos.models
{
    public class Carrera
    {
        public int CarreraId { get; set; }

        public string? Descripcion { get; set; } = null!;

        public int Duracion { get; set; }

        public bool Eliminado { get; set; }

        public virtual ICollection<Asignatura> Asignaturas { get; set; } = new List<Asignatura>();
    }
}