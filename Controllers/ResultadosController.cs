using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClasesVistas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using models;

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
                var sumaNotas = _context.alumno.Sum(a => a.Nota);
                var cantidadAlumnos = _context.alumno.Count();
                resultado.Promedio = Decimal.Round((decimal)sumaNotas / cantidadAlumnos, 2);

                // Nota mas alta y alumno con nota mas alta
                resultado.NotaMasAlta = _context.alumno.Max(a => a.Nota);
                
                // Nota mas baja y alumno con nota mas baja
                resultado.NotaMasBaja =  _context.alumno.Min(a => a.Nota);
               
                // Cantidad de aprobados y desaprobados
                resultado.CantidadAprobados = _context.alumno.Where(a => a.Nota >= 6).Count();
                resultado.CantidadDesaprobados = _context.alumno.Where(a => a.Nota < 6).Count();

                if(resultado.Promedio >= 6){
                    resultado.EstadoDelGrupo = "Grupo Aprobado";
                } 
                else
                 {
                    resultado.EstadoDelGrupo = "Grupo Desaprobado";
                }

                
                var alumnoMax = _context.alumno
                .OrderByDescending(a => a.Nota)
                .FirstOrDefault();

                var alumnoMin = _context.alumno
                .OrderBy(a => a.Nota)
                .FirstOrDefault();

                resultado.AlumnoNotaMasAlta = alumnoMax?.Nombre ?? "Sin nombre";
                resultado.AlumnoNotaMasBaja = alumnoMin?.Nombre ?? "Sin nombre";


            return resultado;
        }
    }
}