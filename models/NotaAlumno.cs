using Microsoft.EntityFrameworkCore.Metadata.Internal;
 
        namespace _2026Alumnos.models
{
    public class NotaAlumno
    {
        
        public int NotaAlumnoID { get; set; }
        public DateTime Fecha { get; set; }
        public int AlumnoID { get; set; }
        public int AsignaturaID { get; set; }
        public TipoInstancia TipoInstancia { get; set; }
        public int Nota { get; set; }
        public virtual Alumno? Alumno { get; set; }
        public virtual Asignatura? Asignatura { get; set; }
    }

    public enum TipoInstancia
    {
        NotaIEv1 = 1,
        NotaIEv2,
        NotaIEv3,
        NotaIEv4,
        NotaRec1,
        NotaRec2,
        NotaIEFI,
        NotaRIEFI
    } 
}
   
    
