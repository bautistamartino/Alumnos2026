using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        return await _context.NotaAlumno
            .Include(n => n.Alumno)
            .Include(n => n.Asignatura)
            .ToListAsync();
        }

        // GET: api/NotaAlumno/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotaAlumno>> GetNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotaAlumno
            .Include(n => n.Alumno)
            .Include(n => n.Asignatura)
            .FirstOrDefaultAsync(n => n.NotaAlumnoId == id);

            if (notaAlumno == null)
                return NotFound();

                return notaAlumno;
        }

        // PUT: api/NotaAlumno/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotaAlumno(int id, NotaAlumno notaAlumno)
        {
            if (id != notaAlumno.NotaAlumnoId)
            {
                return BadRequest();
            }

            _context.Entry(notaAlumno).State = EntityState.Modified;

            try
            {
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
            _context.NotaAlumno.Add(notaAlumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotaAlumno", new { id = notaAlumno.NotaAlumnoId }, notaAlumno);
        }

        // DELETE: api/NotaAlumno/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotaAlumno(int id)
        {
            var notaAlumno = await _context.NotaAlumno.FindAsync(id);
            if (notaAlumno == null)
            {
                return NotFound();
            }

            _context.NotaAlumno.Remove(notaAlumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotaAlumnoExists(int id)
        {
            return _context.NotaAlumno.Any(e => e.NotaAlumnoId == id);
        }
    }
}
