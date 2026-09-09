using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.models; 

namespace _2026Alumnos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AsignaturaController : ControllerBase
    {
        private readonly Context _context; 

        public AsignaturaController(Context context)
        {
            _context = context;
        }

        // GET: api/Asignatura
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asignatura>>> GetAsignatura()
        {
            return await _context.Asignaturas.ToListAsync();
        }

        // GET: api/Asignatura/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Asignatura>> GetAsignatura(int id)
        {
            var asignatura = await _context.Asignaturas.FindAsync(id);

            if (asignatura == null)
            {
                return NotFound();
            }

            return asignatura;
        }

        // PUT: api/Asignatura/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsignatura(int id, Asignatura asignatura)
        {

            
            asignatura.Descripcion = asignatura.Descripcion?.Trim().ToUpper();
            
            if (id != asignatura.AsignaturaId)
            {
                return BadRequest();
            }

            var carrera = await _context.Carreras.FindAsync(asignatura.CarreraId);
            if (carrera == null)
            {
                return BadRequest(new { mensaje = "La carrera seleccionada no existe." });
            }

            if (asignatura.Año < 1 || asignatura.Año > carrera.Duracion)
            {
                return BadRequest(new { mensaje = "El año de la asignatura no es válido para la duración de la carrera." });
            }

            _context.Entry(asignatura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AsignaturaExists(id))
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

        // POST: api/Asignatura
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Asignatura>> PostAsignatura(Asignatura asignatura)
        {
            asignatura.Descripcion = asignatura.Descripcion?.Trim().ToUpper();

            var carrera = await _context.Carreras.FindAsync(asignatura.CarreraId);
            if (carrera == null)
            {
                return BadRequest(new { mensaje = "La carrera seleccionada no existe." });
            }

            if (asignatura.Año < 1 || asignatura.Año > carrera.Duracion)
            {
                return BadRequest(new { mensaje = "El año de la asignatura no es válido para la duración de la carrera." });
            }

            _context.Asignaturas.Add(asignatura);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAsignatura),
                new { id = asignatura.AsignaturaId },
                new
                {
                    asignaturaId = asignatura.AsignaturaId,
                    descripcion = asignatura.Descripcion,
                    año = asignatura.Año,
                    carreraId = asignatura.CarreraId,
                    eliminado = asignatura.Eliminado
                });
        }

        // DELETE: api/Asignatura/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignatura(int id)
        {
            var asignatura = await _context.Asignaturas.FindAsync(id);
            if (asignatura == null)
            {
                return NotFound();
            }

            _context.Asignaturas.Remove(asignatura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AsignaturaExists(int id)
        {
            return _context.Asignaturas.Any(e => e.AsignaturaId == id);
        }
    }
}
