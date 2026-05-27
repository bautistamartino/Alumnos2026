using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.models;
using ApiAlumnos2026.Models;



namespace _2026Alumnos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlumnoController : ControllerBase
    {
        private readonly Context _context;

        public AlumnoController(Context context)
        {
            _context = context;
        }

        // GET: api/Alumno
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Alumno>>> GetAlumno()
        {
            return await _context.Alumnos.ToListAsync();
        }

        // GET: api/Alumno/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Alumno>> GetAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);

            if (alumno == null)
            {
                return NotFound();
            }

            return alumno;
        }

        // PUT: api/Alumno/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlumno(int id, Alumno alumno)
        {

            // NORMALIZAR
            alumno.NombreCompleto = alumno.NombreCompleto?.Trim().ToUpper();
            alumno.Domicilio = alumno.Domicilio?.Trim().ToUpper();
            alumno.DNI = alumno.DNI?.Trim();

            
            var existe = await _context.Alumnos
                .AnyAsync(t => t.DNI == alumno.DNI && t.AlumnoId != id);

            if (existe)
            {
                return Conflict(new { mensaje = "Ya existe un alumno con ese DNI." });
            }

            if (id != alumno.AlumnoId)
            {
                return BadRequest();
            }

            try
            {
                var AlumnoOriginal = await _context.Alumnos.FindAsync(id);
                if (AlumnoOriginal == null)
                {
                    return NotFound();
                }

                if (AlumnoOriginal.NombreCompleto != alumno.NombreCompleto)
                {
                    var cambioAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "NOMBRE",
                        ValorAnterior = AlumnoOriginal.NombreCompleto,
                        ValorNuevo = alumno.NombreCompleto
                    };
                    _context.HistorialAlumnos.Add(cambioAlumno);
                }


                if (AlumnoOriginal.DNI != alumno.DNI){
                    var cambioAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "DNI",
                        ValorAnterior = AlumnoOriginal.DNI,
                        ValorNuevo = alumno.DNI
                    };
                    _context.HistorialAlumnos.Add(cambioAlumno);
                }

                if (AlumnoOriginal.Sexo != alumno.Sexo)
                {
                    var cambioAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "SEXO",
                        ValorAnterior = AlumnoOriginal.Sexo.ToString(),
                        ValorNuevo = alumno.Sexo.ToString()
                    };
                    _context.HistorialAlumnos.Add(cambioAlumno);
                }
                
                if (AlumnoOriginal.Domicilio != alumno.Domicilio)
                {
                    var cambioAlumno = new HistorialAlumno
                    {
                        AlumnoID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "DOMICILIO",
                        ValorAnterior = AlumnoOriginal.Domicilio,
                        ValorNuevo = alumno.Domicilio
                    };
                    _context.HistorialAlumnos.Add(cambioAlumno);
                }

                
                AlumnoOriginal.NombreCompleto = alumno.NombreCompleto;
                AlumnoOriginal.DNI = alumno.DNI;
                AlumnoOriginal.Sexo = alumno.Sexo;
                AlumnoOriginal.Domicilio = alumno.Domicilio;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlumnoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al guardar los cambios del alumno.", detalle = dbEx.Message });
            }

            return NoContent();
        }

        // POST: api/Alumno
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Alumno>> PostAlumno(Alumno alumno)
        {
            // NORMALIZAR
            alumno.NombreCompleto = alumno.NombreCompleto?.Trim().ToUpper();
            alumno.Domicilio = alumno.Domicilio?.Trim().ToUpper();
            alumno.DNI = alumno.DNI?.Trim();

            // VALIDACIONES
            if (string.IsNullOrWhiteSpace(alumno.NombreCompleto))
            {
                return BadRequest(new { mensaje = "El nombre es obligatorio." });
            }

            if (string.IsNullOrWhiteSpace(alumno.DNI))
            {
                return BadRequest(new { mensaje = "El DNI es obligatorio." });
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(alumno.DNI, @"^\d{8}$"))
            {
                return BadRequest(new { mensaje = "El DNI debe tener 8 números." });
            }

            // VALIDAR DUPLICADO
            var existe = await _context.Alumnos
                .AnyAsync(t => t.DNI == alumno.DNI);

            if (existe)
            {
                return Conflict(new { mensaje = "Ya existe un alumno con ese DNI." });
            }

            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAlumno", new { id = alumno.AlumnoId }, alumno);
        }

        // DELETE: api/Alumno/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound();
            }

            _context.Alumnos.Remove(alumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AlumnoExists(int id)
        {
            return _context.Alumnos.Any(e => e.AlumnoId == id);
        }
    }
}