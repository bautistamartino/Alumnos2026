using System.ComponentModel.DataAnnotations;

namespace _2026Alumnos.models
{
        public class AsignaturaDocente
    {
        [Key]
        public int AsignaturaDocenteID { get; set; }
        public int AsignaturaID { get; set; }
        public int DocenteID { get; set; }
    }
}