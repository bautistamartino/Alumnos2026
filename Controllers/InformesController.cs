using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.ClasesVistas;
using _2026Alumnos.models;
using ApiAlumnos2026.Models;


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
        public async Task<ActionResult<IEnumerable<VistaPromedioAlumno>>> PostAsignatura(FiltroNotaAlumno filtro)
        {
            List<VistaPromedioAlumno> alumnosMostrar = new List<VistaPromedioAlumno>();

            var alumnos = await _context.Alumnos.ToListAsync();

            if (filtro.AlumnoID > 0)
            {
                alumnos = alumnos.Where(a => a.AlumnoId == filtro.AlumnoID).ToList();
            }

            foreach (var alumno in alumnos)
            {
                var notasAlumno = await _context.NotaAlumnos
                    .Where(a => a.AlumnoID == alumno.AlumnoId)
                    .ToListAsync();

                if (filtro.AsignaturaID > 0)
                {
                    notasAlumno = notasAlumno
                        .Where(a => a.AsignaturaID == filtro.AsignaturaID)
                        .ToList();
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

                    notasAlumno = notasAlumno
                        .Where(t => t.Fecha >= fechaDesde && t.Fecha <= fechaHasta)
                        .ToList();
                }

                if (notasAlumno.Count > 0)
                {
                    var alumnoMostrar = new VistaPromedioAlumno
                    {
                        NombreCompleto = alumno.NombreCompleto,
                        DNI = alumno.DNI,
                        Promedio = decimal.Round(
                            Convert.ToDecimal(notasAlumno.Sum(n => n.Nota)) / notasAlumno.Count,
                            2
                        )
                    };

                    alumnosMostrar.Add(alumnoMostrar);
                }
            }

            alumnosMostrar = alumnosMostrar.OrderBy(a => a.NombreCompleto).ToList();

            return alumnosMostrar;
        }

        [HttpPost("promedioasignaturas")]
        public async Task<ActionResult<IEnumerable<VistaPromedioAsignatura>>> GetAsignaturaPromedio([FromBody] FiltroNotaAlumno filtro) 
        {
            List<VistaPromedioAsignatura> asignaturasMostrar = new List<VistaPromedioAsignatura>();

            var asignaturas = await _context.Asignaturas.ToListAsync();

            foreach (var asignatura in asignaturas)
            {
                var notasAsignatura = await _context.NotaAlumnos
                    .Where(n => n.AsignaturaID == asignatura.AsignaturaId)
                    .ToListAsync();

                if (filtro.AsignaturaID > 0)
                {
                    notasAsignatura = notasAsignatura
                        .Where(n => n.AsignaturaID == filtro.AsignaturaID)
                        .ToList();
                }

                if (filtro.AlumnoID > 0)
                {
                    notasAsignatura = notasAsignatura
                        .Where(n => n.AlumnoID == filtro.AlumnoID)
                        .ToList();
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

                    notasAsignatura = notasAsignatura
                        .Where(t => t.Fecha >= fechaDesde && t.Fecha <= fechaHasta)
                        .ToList();
                }

                if (notasAsignatura.Count > 0)
                {
                    var asignaturaMostrar = new VistaPromedioAsignatura
                    {
                        AsignaturaID = asignatura.AsignaturaId,
                        AsignaturaNombre = asignatura.Descripcion,
                        Promedio = decimal.Round(
                            Convert.ToDecimal(notasAsignatura.Sum(n => n.Nota)) / notasAsignatura.Count,
                            2
                        )
                    };

                    asignaturasMostrar.Add(asignaturaMostrar);
                }
            }

            asignaturasMostrar = asignaturasMostrar
                .OrderBy(a => a.AsignaturaNombre)
                .ToList();

            return asignaturasMostrar;
        }

        [HttpGet("historialnota/{id}")]
        public async Task<ActionResult<IEnumerable<VistaHistorialNotaAlumno>>> GetHistorial(int id)
        {
            List<VistaHistorialNotaAlumno> asignaturaMostrar = new List<VistaHistorialNotaAlumno>();

            var historiales = await _context.HistorialNotaAlumnos
                .Where(a => a.NotaAlumnoID == id)
                .OrderByDescending(a => a.FechaCambio)
                .ToListAsync();

            foreach (var historial in historiales)
            {
                var alumnoMostrar = new VistaHistorialNotaAlumno
                {
                    FechaCambioString = historial.FechaCambio.ToString("dd/MM/yyyy HH:mm"),
                    CampoModificado = historial.CampoModificado,
                    ValorAnterior = historial.ValorAnterior,
                    ValorNuevo = historial.ValorNuevo
                };

                asignaturaMostrar.Add(alumnoMostrar);
            }

            return asignaturaMostrar;
        }
        [HttpGet("historialalumno/{id}")]
        public async Task<ActionResult<IEnumerable<VistaHistorialAlumno>>> GetHistorialAlumno(int id)
        {
            List<VistaHistorialAlumno> asignaturaMostrar = new List<VistaHistorialAlumno>();

            var historiales = await _context.HistorialAlumnos
                .Where(a => a.AlumnoID == id)
                .OrderByDescending(a => a.FechaCambio)
                .ToListAsync();

            foreach (var historial in historiales)
            {
                var alumnoMostrar = new VistaHistorialAlumno
                {
                    FechaCambioString = historial.FechaCambio.ToString("dd/MM/yyyy HH:mm"),
                    CampoModificado = historial.CampoModificado,
                    ValorAnterior = historial.ValorAnterior,
                    ValorNuevo = historial.ValorNuevo
                };

                asignaturaMostrar.Add(alumnoMostrar);
            }

            return asignaturaMostrar;
        }


        [HttpGet("historialdocente/{id}")]
        public async Task<ActionResult<IEnumerable<VistaHistorialDocente>>> GetHistorialDocente(int id)
        {
            List<VistaHistorialDocente> asignaturaMostrar = new List<VistaHistorialDocente>();

            var historiales = await _context.HistorialDocentes
                .Where(a => a.DocenteID == id)
                .OrderByDescending(a => a.FechaCambio)
                .ToListAsync();

            foreach (var historial in historiales)
            {
                var docenteMostrar = new VistaHistorialDocente
                {
                    FechaCambioString = historial.FechaCambio.ToString("dd/MM/yyyy HH:mm"),
                    CampoModificado = historial.CampoModificado,
                    ValorAnterior = historial.ValorAnterior,
                    ValorNuevo = historial.ValorNuevo
                };

                asignaturaMostrar.Add(docenteMostrar);
            }

            return asignaturaMostrar;
        }
    }
}