using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using _2026Alumnos.models;
using ApiAlumnos2026.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _2026Alumnos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DocenteController : ControllerBase
    {
        private readonly Context _context;

        public DocenteController(Context context)
        {
            _context = context;
        }

        // GET: api/Docente
        [HttpGet]
public async Task<IActionResult> GetDocente()
{
    try
    {
        var docentes = await _context.Docentes.ToListAsync();
        return Ok(docentes);
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.ToString());
    }
}

        // GET: api/Docente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Docente>> GetDocente(int id)
        {
            var docente = await _context.Docentes.FindAsync(id);

            if (docente == null)
            {
                return NotFound();
            }

            return docente;
        }

        // PUT: api/Docente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocente(int id, Docente docente)
        {

            // NORMALIZAR
            docente.NombreCompleto = docente.NombreCompleto?.Trim().ToUpper();
            docente.DNI = docente.DNI?.Trim();

            var existe = await _context.Docentes
                .AnyAsync(t => t.DNI == docente.DNI && t.DocenteId != id);

            if (existe)
            {
                return Conflict(new { mensaje = "Ya existe un docente con ese DNI." });
            }

            if (id != docente.DocenteId)
            {
                return BadRequest();
            }

            try
            {
                var DocenteOriginal = await _context.Docentes.FindAsync(id);
                if (DocenteOriginal == null)
                {
                    return NotFound();
                }

                if (DocenteOriginal.NombreCompleto != docente.NombreCompleto)
                {
                    var cambioDocente = new HistorialDocente
                    {
                        DocenteID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "NOMBRE",
                        ValorAnterior = DocenteOriginal.NombreCompleto,
                        ValorNuevo = docente.NombreCompleto
                    };
                    _context.HistorialDocentes.Add(cambioDocente);
                }


                if (DocenteOriginal.DNI != docente.DNI){
                    var cambioDocente = new HistorialDocente
                    {
                        DocenteID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "DNI",
                        ValorAnterior = DocenteOriginal.DNI,
                        ValorNuevo = docente.DNI
                    };
                    _context.HistorialDocentes.Add(cambioDocente);
                }

                if (DocenteOriginal.Sexo != docente.Sexo)
                {
                    var cambioDocente = new HistorialDocente    
                    {
                        DocenteID = id,
                        FechaCambio = DateTime.Now,
                        CampoModificado = "SEXO",
                        ValorAnterior = DocenteOriginal.Sexo.ToString(),
                        ValorNuevo = docente.Sexo.ToString()
                    };
                    _context.HistorialDocentes.Add(cambioDocente);
                }


                
                DocenteOriginal.NombreCompleto = docente.NombreCompleto;
                DocenteOriginal.DNI = docente.DNI;
                DocenteOriginal.Sexo = docente.Sexo;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocenteExists(id))
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
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al guardar los cambios del docente.", detalle = dbEx.Message });
            }

            return NoContent();
        }

        // POST: api/Docente
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Docente>> PostDocente(Docente docente)
        {
            // NORMALIZAR
            docente.NombreCompleto = docente.NombreCompleto?.Trim().ToUpper();
            docente.DNI = docente.DNI?.Trim();

            // VALIDACIONES
            if (string.IsNullOrWhiteSpace(docente.NombreCompleto))
            {
                return BadRequest(new { mensaje = "El nombre es obligatorio." });
            }

            if (string.IsNullOrWhiteSpace(docente.DNI))
            {
                return BadRequest(new { mensaje = "El DNI es obligatorio." });
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(docente.DNI, @"^\d{8}$"))
            {
                return BadRequest(new { mensaje = "El DNI debe tener 8 números." });
            }

            // VALIDAR DUPLICADO
            var existe = await _context.Docentes
                .AnyAsync(t => t.DNI == docente.DNI);

            if (existe)
            {
                return Conflict(new { mensaje = "Ya existe un docente con ese DNI." });
            }

            _context.Docentes.Add(docente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocente", new { id = docente.DocenteId }, docente);
        }

        // DELETE: api/Docente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocente(int id)
        {
            var docente = await _context.Docentes.FindAsync(id);
            if (docente == null)
            {
                return NotFound();
            }

            _context.Docentes.Remove(docente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocenteExists(int id)
        {
            return _context.Docentes.Any(e => e.DocenteId == id);
        }
    }
}