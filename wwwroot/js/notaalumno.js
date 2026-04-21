function ObtenerNotas() {
    fetch('https://localhost:7177/NotaAlumno')
    .then(r => r.json())
    .then(data => MostrarNotas(data))
    .catch(e => console.error(e));
}

function MostrarNotas(data) {
    $("#TablaNotas").empty();

    data.forEach(n => {
        $("#TablaNotas").append(`
            <tr>
                <td>${n.notaAlumnoId}</td>
                <td>${n.alumno?.nombreCompleto ?? n.alumnoId}</td>
                <td>${n.asignatura?.descripcion ?? n.asignaturaId}</td>
                <td>${n.nota}</td>
                <td><button class="btn btn-info" onclick="BuscarNota(${n.notaAlumnoId})">Editar</button></td>
                <td><button class="btn btn-danger" onclick="EliminarNota(${n.notaAlumnoId})">Eliminar</button></td>
            </tr>
        `);
    });
}

function CargarAlumnos() {
    
    fetch('https://localhost:7177/Alumno')
    .then(r => r.json())
    .then(data => {
        let select = $("#AlumnoId, #AlumnoIdEditar");
        select.empty();

        data.forEach(a => {
            select.append(`<option value="${a.alumnoId}">${a.nombreCompleto}</option>`);
        });
    });
}

function CargarAsignaturas() {
    fetch('https://localhost:7177/Asignatura')
    .then(r => r.json())
    .then(data => {
        let select = $("#AsignaturaId, #AsignaturaIdEditar");
        select.empty();

        data.forEach(a => {
            select.append(`<option value="${a.asignaturaId}">${a.descripcion}</option>`);
        });
    });
}

function CrearNota() {

    let nota = document.getElementById("Nota").value;

    if (nota < 1 || nota > 10) {
        alert("Nota inválida");
        return;
    }

    let obj = {
        alumnoId: parseInt(document.getElementById("AlumnoId").value),
        asignaturaId: parseInt(document.getElementById("AsignaturaId").value),
        nota: parseInt(nota)
    };

    fetch('https://localhost:7177/NotaAlumno', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    .then(r => r.json())
    .then(() => {
let modal = bootstrap.Modal.getInstance(document.getElementById('ModalAgregarNotaAlumno'));

if (!modal) {
    modal = new bootstrap.Modal(document.getElementById('ModalAgregarNotaAlumno'));
}

modal.hide();
        ObtenerNotas();
    });
}

function BuscarNota(id) {
    fetch(`https://localhost:7177/NotaAlumno/${id}`)
    .then(r => r.json())
    .then(n => {

        document.getElementById("IdEditar").value = n.notaAlumnoId;
        document.getElementById("AlumnoIdEditar").value = n.alumnoId;
        document.getElementById("AsignaturaIdEditar").value = n.asignaturaId;
        document.getElementById("NotaEditar").value = n.nota;

        new bootstrap.Modal(document.getElementById('ModalEditarNotaAlumno')).show();
    });
}

function EditarNota() {

    let nota = document.getElementById("NotaEditar").value;

    if (nota < 1 || nota > 10) {
        alert("Nota inválida");
        return;
    }

    let obj = {
        notaAlumnoId: parseInt(document.getElementById("IdEditar").value),
        alumnoId: parseInt(document.getElementById("AlumnoIdEditar").value),
        asignaturaId: parseInt(document.getElementById("AsignaturaIdEditar").value),
        nota: parseInt(document.getElementById("NotaEditar").value)
    };

    fetch(`https://localhost:7177/NotaAlumno/${obj.notaAlumnoId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
    .then(() => {
        let modal = bootstrap.Modal.getInstance(document.getElementById('ModalEditarNotaAlumno'));

        if (!modal) {
            modal = new bootstrap.Modal(document.getElementById('ModalEditarNotaAlumno'));
        }

        modal.hide();
        ObtenerNotas();
    });
}

function EliminarNota(id) {
    if (!confirm("¿Eliminar nota?")) return;

    fetch(`https://localhost:7177/NotaAlumno/${id}`, {
        method: 'DELETE'
    })
    .then(() => ObtenerNotas());
}

