    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using models;

        public class Context : DbContext
        {
            public Context (DbContextOptions<Context> options)
                : base(options)
            {
            }

            public DbSet<models.NotaAlumno> notaalumno { get; set; } = default!;

public DbSet<models.Asignatura> Asignatura { get; set; } = default!;
        }
