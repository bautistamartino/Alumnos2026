using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.ClasesVistas;


namespace _2026Alumnos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class InformesController : ControllerBase
    {
        private readonly Context _context;

        public InformesController(Context context)
        {
            _context = context;
        }

        [HttpPost("promedioalumnos")]
        public async Task<ActionResult<IEnumerable<PromedioNotaAlumno>>> PostAsignatura(FiltroNotaAlumno filtro)
        {
            
            List<PromedioNotaAlumno> alumnosMostrar = new List<PromedioNotaAlumno>();

            var alumnos = await _context.Alumno.ToListAsync();

            foreach (var alumno in alumnos)
            {
                var notasAlumno = await _context.NotaAlumno.Where(a => a.AlumnoId == alumno.AlumnoId).ToListAsync();
                if (filtro.AsignaturaID > 0)
                {
                    notasAlumno = notasAlumno.Where(a => a.AsignaturaId == filtro.AsignaturaID).ToList();
                }

                DateTime fechaDesde = new DateTime();
                bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

                DateTime fechaHasta = new DateTime();
                bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

                if (fechaDesdeValida && fechaHastaValida)
                {
                    fechaHasta = fechaHasta.AddHours(23);
                    fechaHasta = fechaHasta.AddMinutes(59);
                    fechaHasta = fechaHasta.AddSeconds(59);
                    notasAlumno = notasAlumno.Where(t => t.Fecha >= fechaDesde && t.Fecha <= fechaHasta).ToList();

                }


                if (notasAlumno.Count > 0)
                {
                    var alumnoMostrar = new PromedioNotaAlumno
                    {
                        NombreCompleto = alumno.NombreCompleto,
                        DNI = alumno.DNI,
                        promedio = decimal.Round(Convert.ToDecimal(notasAlumno.Sum(n => n.Nota)) / notasAlumno.Count, 2)
                    };
                    alumnosMostrar.Add(alumnoMostrar);
                }

            }

            alumnosMostrar = alumnosMostrar.OrderBy(a => a.NombreCompleto).ToList();

            return alumnosMostrar.ToList();            
        }

    

    
        [HttpPost("promedioasignaturas")]
        public async Task<ActionResult<IEnumerable<PromedioNotaAsignatura>>> PostAsignaturaPromedio(FiltroNotaAsignatura filtro)
        {
            
            List<PromedioNotaAsignatura> asignaturasMostrar = new List<PromedioNotaAsignatura>();

            var asignaturas = await _context.Asignatura.ToListAsync();

            foreach (var asignatura in asignaturas)  
            {
                var notasAsignatura = await _context.NotaAlumno.Where(n => n.AsignaturaId == asignatura.AsignaturaId).ToListAsync();
                if (filtro.AsignaturaID > 0)
                {
                    notasAsignatura = notasAsignatura.Where(n => n.AsignaturaId == filtro.AsignaturaID).ToList();
                }
                
                if (filtro.AlumnoID > 0)
                {
                    notasAsignatura = notasAsignatura.Where(n => n.AlumnoId == filtro.AlumnoID).ToList();
                }

                 DateTime fechaDesde = new DateTime();
                bool fechaDesdeValida = DateTime.TryParse(filtro.FechaDesde, out fechaDesde);

                DateTime fechaHasta = new DateTime();
                bool fechaHastaValida = DateTime.TryParse(filtro.FechaHasta, out fechaHasta);

                if (fechaDesdeValida && fechaHastaValida)
                {
                    fechaHasta = fechaHasta.AddHours(23);
                    fechaHasta = fechaHasta.AddMinutes(59);
                    fechaHasta = fechaHasta.AddSeconds(59);
                    notasAsignatura = notasAsignatura.Where(t => t.Fecha >= fechaDesde && t.Fecha <= fechaHasta).ToList();

                }

                if (notasAsignatura.Count > 0)
                {
                    var asignaturaMostrar = new PromedioNotaAsignatura
                    {
                        AsignaturaId = asignatura.AsignaturaId,
                        NombreAsignatura = asignatura.Descripcion,
                        promedioAsignatura = decimal.Round(Convert.ToDecimal(notasAsignatura.Sum(n => n.Nota)) / notasAsignatura.Count, 2)
                    };
                    asignaturasMostrar.Add(asignaturaMostrar);
                }

                }
                 asignaturasMostrar = asignaturasMostrar.OrderBy(a => a.NombreAsignatura).ToList();   

               return asignaturasMostrar.ToList();          
        }
    } 

}
    


