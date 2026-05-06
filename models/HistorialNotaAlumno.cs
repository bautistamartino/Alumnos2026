public class HistorialNotaAlumno
{
    public int HistorialNotaAlumnoId { get; set; }
    public int NotaAlumnoId { get; set; }
    public string? CampoModificado { get; set; }
    public string? ValorAnterior { get; set; }
    public string? ValorNuevo { get; set; }
    public DateTime Fechacambio { get; set; }
}
