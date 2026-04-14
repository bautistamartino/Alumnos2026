using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using models;

namespace Alumnos2026.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class alumnoController : ControllerBase
    {
        private readonly Context _context;

        public alumnoController(Context context)
        {
            _context = context;
        }

        // GET: api/alumno
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Alumno>>> Getalumno()
        {
            return await _context.alumno.ToListAsync();
        }

        // GET: api/alumno/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Alumno>> Getalumno(int id)
        {
            var alumno = await _context.alumno.FindAsync(id);

            if (alumno == null)
            {
                return NotFound();
            }

            return alumno;
        }

        // PUT: api/alumno/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Putalumno(int id, Alumno alumno)
        {
            if (id != alumno.Id)
            {
                return BadRequest();
            }

            _context.Entry(alumno).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!alumnoExists(id))
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

        // POST: api/alumno
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Alumno>> Postalumno(Alumno alumno)
        {
            _context.alumno.Add(alumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getalumno", new { id = alumno.Id }, alumno);
        }

        // DELETE: api/alumno/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletealumno(int id)
        {
            var alumno = await _context.alumno.FindAsync(id);
            if (alumno == null)
            {
                return NotFound();
            }

            _context.alumno.Remove(alumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool alumnoExists(int id)
        {
            return _context.alumno.Any(e => e.Id == id);
        }
    }
}
