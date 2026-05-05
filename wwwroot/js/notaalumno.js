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
                <td>${new Date(n.fecha).toLocaleDateString('es-AR')}</td>
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

        select.append(`<option value="" selected disabled>Seleccione un alumno</option>`);

        data.forEach(a => {
            select.append(`<option value="${a.alumnoId}">${a.nombreCompleto}</option>`);
        });
    });
    $('#ModalAgregarNotaAlumno').on('show.bs.modal', function () {
    $("#AlumnoId").val("");
});
}

function CargarAsignaturas() {
    fetch('https://localhost:7177/Asignatura')
    .then(r => r.json())
    .then(data => {
        let select = $("#AsignaturaId, #AsignaturaIdEditar");
        select.empty();

        select.append(`<option value="" selected disabled>Seleccione una asignatura</option>`);

        data.forEach(a => {
            select.append(`<option value="${a.asignaturaId}">${a.descripcion}</option>`);
        });
        
    });
    $('#ModalAgregarNotaAlumno').on('show.bs.modal', function () {
    $("#AsignaturaId").val("");
});
}

function CrearNota() {

    let alumnoId = document.getElementById("AlumnoId").value;
    let asignaturaId = document.getElementById("AsignaturaId").value;
    let nota = document.getElementById("Nota").value;
    let fecha = document.getElementById("fecha").value;

    if (!alumnoId) {
        document.getElementById("AlumnoId").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debes seleccionar un alumno'
        });
        return;
    } else {
        document.getElementById("AlumnoId").classList.remove("is-invalid");
    }

    if (!asignaturaId) {
        document.getElementById("AsignaturaId").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debes seleccionar una asignatura'
        });
        return;
    } else {
        document.getElementById("AsignaturaId").classList.remove("is-invalid");
    }
    
    if (nota < 1 || nota > 10) {
        Swal.fire({
        icon: 'error',
        title: 'Nota inválida',
        text: 'La nota debe estar entre 1 y 10'
    });
        return;
    }

     if (!fecha) {
        document.getElementById("fecha").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta fecha',
            text: 'Debes seleccionar una fecha'
        });
        return;
    } else {
        document.getElementById("fecha").classList.remove("is-invalid");
    }

    let obj = {
        alumnoId: parseInt(document.getElementById("AlumnoId").value),
        asignaturaId: parseInt(document.getElementById("AsignaturaId").value),
        nota: parseInt(nota),
        fecha: document.getElementById("fecha").value
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
        document.getElementById("fechaEditar").value = n.fecha.split('T')[0];

        new bootstrap.Modal(document.getElementById('ModalEditarNotaAlumno')).show();
    });
}

function EditarNota() {

let alumnoId = document.getElementById("AlumnoIdEditar").value;
let asignaturaId = document.getElementById("AsignaturaIdEditar").value;
let nota = document.getElementById("NotaEditar").value;
let fecha = document.getElementById("fechaEditar").value;

    if (!alumnoId) {
        document.getElementById("AlumnoId").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debes seleccionar un alumno'
        });
        return;
    } else {
        document.getElementById("AlumnoId").classList.remove("is-invalid");
    }

    if (!asignaturaId) {
        document.getElementById("AsignaturaId").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debes seleccionar una asignatura'
        });
        return;
    } else {
        document.getElementById("AsignaturaId").classList.remove("is-invalid");
    }
    
    if (nota < 1 || nota > 10) {
        Swal.fire({
        icon: 'error',
        title: 'Nota inválida',
        text: 'La nota debe estar entre 1 y 10'
    });
        return;
    }

     if (!fecha) {
        document.getElementById("fecha").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta fecha',
            text: 'Debes seleccionar una fecha'
        });
        return;
    } else {
        document.getElementById("fecha").classList.remove("is-invalid");
    }
    let obj = {
        notaAlumnoId: parseInt(document.getElementById("IdEditar").value),
        alumnoId: parseInt(document.getElementById("AlumnoIdEditar").value),
        asignaturaId: parseInt(document.getElementById("AsignaturaIdEditar").value),
        nota: parseInt(document.getElementById("NotaEditar").value),
        fecha: document.getElementById("fechaEditar").value
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

