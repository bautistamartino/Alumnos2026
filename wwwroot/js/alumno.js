function ObtenerAlumnos() {
fetch('https://localhost:7063/Alumno')
.then(response => response.json())
.then(data => MostrarAlumnos(data))
.catch(error => console.error('Error: No se puede acceder al servicio', error));
}

function MostrarAlumnos(data) {
    $("#TodosLosAlumnos").empty();
    $.each(data, function (index, alumno) {
        $("#TodosLosAlumnos").append(
            "<tr>" +
                "<td>" + alumno.id + "</td>" +
                "<td>" + alumno.nombre + "</td>" +
                "<td>" + alumno.dni + "</td>" +
                "<td>" + alumno.nota + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarAlumnoId(" + alumno.id + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarAlumno(" + alumno.id + ")'>Eliminar</button></td>" +
            "</tr>"
        );
    });
}

function CrearAlumno() {
  
    let alumno = {
        nombre: document.getElementById("Nombre").value,
        dni: document.getElementById("Dni").value,
        nota: document.getElementById("Nota").value,
    }

    fetch('https://localhost:7063/Alumno',
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(alumno)
        })
    .then(response => {
	if (!response.ok) throw new Error("Error en el servidor");
	return response.json();
    })
    .then(() => {
var modal = bootstrap.Modal.getInstance(document.getElementById('ModalAgregarAlumno'));
modal.hide();
	
        document.getElementById("Nombre").value = "";
        document.getElementById("Dni").value = "";
        document.getElementById("Nota").value = 0; 

        ObtenerAlumnos();
        }
       )
    .catch(error => console.log("Hubo un error al guardar un nuevo alumno, verifique el mensaje error: ", error));
}


function EliminarAlumno(id) {
    if (!confirm("¿Seguro que desea eliminar este alumno?")) return;

    fetch(`https://localhost:7063/Alumno/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return; // NO json()
    })
    .then(() => {
        ObtenerAlumnos(); // 🔥 actualiza tabla
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function BuscarAlumnoId(id) {
    fetch(`https://localhost:7063/Alumno/${id}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) throw new Error("Error al buscar alumno");
        return response.json();
    })
    .then (data => {
        document.getElementById("IdAlumnoEditar").value = data.id;
        document.getElementById("NombreEditar").value = data.nombre;
        document.getElementById("DniEditar").value = data.dni;
        document.getElementById("NotaEditar").value = data.nota;
        var modal = new bootstrap.Modal(document.getElementById('ModalEditarAlumno'));
modal.show();
    })
    .catch(error => console.error("Error al buscar alumno:", error));
}

function EditarAlumno() {
    let alumno = {
        id: document.getElementById("IdAlumnoEditar").value,
        nombre: document.getElementById("NombreEditar").value,
        dni: document.getElementById("DniEditar").value,
        nota: document.getElementById("NotaEditar").value,
    }
    fetch(`https://localhost:7063/Alumno/${alumno.id}`, {
    method: 'PUT',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(alumno)
})
.then(response => {

    // Si no es OK y no es 204 → Error
    if (!response.ok && response.status !== 204) {
        throw new Error("Error al editar el alumno");
    }

    // Si todo salió bien:
    document.getElementById("IdAlumnoEditar").value = "";
    document.getElementById("NombreEditar").value = "";
    document.getElementById("DniEditar").value = "";
    document.getElementById("NotaEditar").value = 0;

    var modal = bootstrap.Modal.getInstance(document.getElementById('ModalEditarAlumno'));
modal.hide();
    ObtenerAlumnos();
})
        .catch(error => console.log("Hubo un error al editar el alumno, verifique el mensaje error: ", error));


}





