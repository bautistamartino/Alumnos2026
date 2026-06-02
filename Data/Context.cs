using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace _2026Alumnos.models;

using ApiAlumnos2026.Models;
using Microsoft.EntityFrameworkCore;

    public class Context : IdentityDbContext<ApplicationUser>
    {
        public Context (DbContextOptions<Context> options)
            : base(options)
        {
        }

public DbSet<Alumno> Alumnos { get; set; } = default!;
public DbSet<NotaAlumno> NotaAlumnos { get; set; } = default!;
public DbSet<Asignatura> Asignaturas { get; set; } = default!;
public DbSet<Docente> Docentes { get; set; } = default!;
public DbSet<HistorialNotaAlumno> HistorialNotaAlumnos { get; set; } = default!;
public DbSet<HistorialAlumno> HistorialAlumnos { get; set; } = default!;
public DbSet<HistorialDocente> HistorialDocentes { get; set; } = default!;
    }
