using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClasesVistas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _2026Alumnos.models;

namespace Alumnos2026.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ResultadosController : ControllerBase
    {
        private readonly Context _context;

        public ResultadosController(Context context)
        {
            _context = context;
        }

        // GET: api/Resultados
        [HttpGet]
        public async Task<ActionResult<ResultadoAlumnos>> GetResultadosInicial()
        {
            ResultadoAlumnos resultado = new ResultadoAlumnos(); 

             

            
                // Promedio
                var cantidadNotas = _context.NotaAlumnos.Count();

                if (cantidadNotas > 0)
            {
                var sumaNotas = _context.NotaAlumnos.Sum(a => a.Nota);
                resultado.Promedio = Decimal.Round((decimal)sumaNotas / cantidadNotas, 2);
            }
                else
            {
                resultado.Promedio = 0;
            }

                // Nota mas alta y alumno con nota mas alta
                resultado.NotaMasAlta = _context.NotaAlumnos.Max(a => a.Nota);
                
                // Nota mas baja y alumno con nota mas baja
                resultado.NotaMasBaja =  _context.NotaAlumnos.Min(a => a.Nota);
               
                // Cantidad de aprobados y desaprobados
                resultado.CantidadAprobados = _context.NotaAlumnos.Where(a => a.Nota >= 6).Count();
                resultado.CantidadDesaprobados = _context.NotaAlumnos.Where(a => a.Nota < 6).Count();

                if(resultado.Promedio >= 6){
                    resultado.EstadoDelGrupo = "Grupo Aprobado";
                } 
                else
                 {
                    resultado.EstadoDelGrupo = "Grupo Desaprobado";
                }

                
                var alumnoMax = _context.NotaAlumnos
                .Include(a => a.Alumno)
                .OrderByDescending(a => a.Nota)
                .FirstOrDefault();

                var alumnoMin = _context.NotaAlumnos
                .Include(a => a.Alumno)
                .OrderBy(a => a.Nota)
                .FirstOrDefault();

                resultado.AlumnoNotaMasAlta = alumnoMax?.Alumno?.NombreCompleto ?? "Sin nombre";
                resultado.AlumnoNotaMasBaja = alumnoMin?.Alumno?.NombreCompleto ?? "Sin nombre";


            return resultado;
        }
    }
}