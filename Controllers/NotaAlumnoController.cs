using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.ClasesVistas; 
using _2026Alumnos.models; 

namespace _2026Alumnos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotaAlumnoController : ControllerBase
    {
        private readonly Context _context;

        public NotaAlumnoController(Context context)
        {
            _context = context;
        }

        // GET: api/NotaAlumno
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaAlumno>>> GetNotaAlumno()
        {
        return await _context.NotaAlumnos
            .Include(n => n.Alumno)
            .Include(n => n.Asignatura)
            .ToListAsync();
        }

        // GET: api/NotaAlumno/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotaAlumno>> GetNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotaAlumnos
            .Include(n => n.Alumno)
            .Include(n => n.Asignatura)
            .FirstOrDefaultAsync(n => n.NotaAlumnoID == id);

            if (notaAlumno == null)
                return NotFound();

                return notaAlumno;
        }

        // PUT: api/NotaAlumno/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotaAlumno(int id, NotaAlumno notaAlumno)
        {

            if (id != notaAlumno.NotaAlumnoID)
            {
                return BadRequest();
            }

            // _context.Entry(notaAlumno).State = EntityState.Modified;

            try
            {
                var notaAlumnoOriginal = _context.NotaAlumnos.Include(n => n.Asignatura).Include(n => n.Alumno).Where(n => n.NotaAlumnoID == id).Single();
            
                if (notaAlumnoOriginal.Fecha != notaAlumno.Fecha)
                {
                    var cambioNota = new HistorialNotaAlumno
                    {
                        NotaAlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "Fecha",
                        ValorAnterior = notaAlumnoOriginal.Fecha.ToString("dd/MM/yyyy"),
                        ValorNuevo = notaAlumno.Fecha.ToString("dd/MM/yyyy")
                    };
                      _context.HistorialNotaAlumnos.Add(cambioNota);
                }

                if (notaAlumnoOriginal.AlumnoID != notaAlumno.AlumnoID)
                {
                    var alumnoNuevo = _context.Alumnos.Where(n => n.AlumnoId == notaAlumno.AlumnoID).Single();
                    var cambioNota = new HistorialNotaAlumno
                    {
                        NotaAlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "ALUMNO",
                        ValorAnterior = notaAlumnoOriginal.Alumno.NombreCompleto,
                        ValorNuevo = alumnoNuevo.NombreCompleto
                    };
                    _context.HistorialNotaAlumnos.Add(cambioNota);
                }

                if (notaAlumnoOriginal.AsignaturaID != notaAlumno.AsignaturaID)
                {
                    var asignaturaNueva = _context.Asignaturas.Where(n => n.AsignaturaId == notaAlumno.AsignaturaID).Single();
                    var cambioNota = new HistorialNotaAlumno
                    {
                        NotaAlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "ASIGNATURA",
                        ValorAnterior = notaAlumnoOriginal.Asignatura.Descripcion,
                        ValorNuevo = asignaturaNueva.Descripcion
                    };
                    _context.HistorialNotaAlumnos.Add(cambioNota);
                }
                if (notaAlumnoOriginal.Nota != notaAlumno.Nota)
                {
                    var cambioNota = new HistorialNotaAlumno
                    {
                        NotaAlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "NOTA",
                        ValorAnterior = notaAlumnoOriginal.Nota.ToString(),
                        ValorNuevo = notaAlumno.Nota.ToString()
                    };
                      _context.HistorialNotaAlumnos.Add(cambioNota);
                }

                notaAlumnoOriginal.Fecha = notaAlumno.Fecha;
                notaAlumnoOriginal.AlumnoID = notaAlumno.AlumnoID;
                notaAlumnoOriginal.AsignaturaID = notaAlumno.AsignaturaID;
                notaAlumnoOriginal.Nota = notaAlumno.Nota;

                await _context.SaveChangesAsync(); 
            }
                catch (DbUpdateConcurrencyException)
            
            {
                if (!NotaAlumnoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/NotaAlumno
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NotaAlumno>> PostNotaAlumno(NotaAlumno notaAlumno)
        {
            _context.NotaAlumnos.Add(notaAlumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotaAlumno", new { id = notaAlumno.NotaAlumnoID }, notaAlumno);
        }

        // DELETE: api/NotaAlumno/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotaAlumnos.FindAsync(id);
            if (notaAlumno == null)
            {
                return NotFound();
            }

            _context.NotaAlumnos.Remove(notaAlumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotaAlumnoExists(int id)
        {
            return _context.NotaAlumnos.Any(e => e.NotaAlumnoID == id);
        }
    }
}
