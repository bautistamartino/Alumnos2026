using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

    public class Context : DbContext
    {
        public Context (DbContextOptions<Context> options)
            : base(options)
        {
        }

        public DbSet<Alumno> Alumno { get; set; } = default!;

public DbSet<NotaAlumno> NotaAlumno { get; set; } = default!;

public DbSet<Asignatura> Asignatura { get; set; } = default!;

public DbSet<Docente> Docente { get; set; } = default!;
    }
