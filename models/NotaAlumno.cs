public class NotaAlumno
{
    public int NotaAlumnoId { get; set; }

    public int AlumnoId { get; set; }

    public int AsignaturaId { get; set; }

    public int Nota { get; set; }

    public Alumno? Alumno { get; set; }
    public Asignatura? Asignatura { get; set; }
}