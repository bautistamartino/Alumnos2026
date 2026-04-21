function ObtenerAlumnos() {
    fetch('https://localhost:7177/Alumno')
    .then(response => {
        if (!response.ok) throw new Error("Error en la API");
        return response.json();
    })
    .then(data => MostrarAlumnos(data))
    .catch(error => console.error('Error real:', error));
}

function MostrarAlumnos(data) {
    $("#TodosLosAlumnos").empty();

    $.each(data, function (index, alumno) {

        let sexoTexto = "";

        switch (alumno.sexo) {
            case 0: sexoTexto = "Masculino"; break;
            case 1: sexoTexto = "Femenino"; break;
            case 2: sexoTexto = "Otro"; break;
        }

        $("#TodosLosAlumnos").append(
            "<tr>" +
                "<td>" + alumno.alumnoId + "</td>" +
                "<td>" + alumno.nombreCompleto + "</td>" +
                "<td>" + alumno.dni + "</td>" +
                "<td>" + sexoTexto + "</td>" +
                "<td>" + alumno.domicilio + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarAlumnoId(" + alumno.alumnoId + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarAlumno(" + alumno.alumnoId + ")'>Eliminar</button></td>" +
            "</tr>"
        );
    });
}

function CrearAlumno() {

    let nombre = document.getElementById("Nombre").value.trim();
    let dni = document.getElementById("Dni").value;
    let sexo = document.getElementById("Sexo").value;
    let domicilio = document.getElementById("Domicilio").value.trim();

    if (nombre === "") {
        alert("El nombre es obligatorio");
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe tener 8 números");
        return;
    }

    if (sexo === "") {
        alert("Seleccione un sexo");
        return;
    }

    if (domicilio === "") {
        alert("El domicilio es obligatorio");
        return;
    }

    let alumno = {
        nombreCompleto: nombre,
        dni: parseInt(dni),
        sexo: parseInt(sexo),
        domicilio: domicilio
    };

    fetch('https://localhost:7177/Alumno', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(alumno)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al crear");
        return response.json();
    })
    .then(() => {

        bootstrap.Modal.getInstance(document.getElementById('ModalAgregarAlumno')).hide();

        document.getElementById("Nombre").value = "";
        document.getElementById("Dni").value = "";
        document.getElementById("Sexo").value = "";
        document.getElementById("Domicilio").value = "";

        ObtenerAlumnos();
    })
    .catch(error => console.error(error));
}

function EliminarAlumno(id) {
    if (!confirm("¿Seguro que desea eliminar este alumno?")) return;

    fetch(`https://localhost:7177/Alumno/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return; // NO json()
    })
    .then(() => {
        ObtenerAlumnos(); 
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function BuscarAlumnoId(id) {
    fetch(`https://localhost:7177/Alumno/${id}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) throw new Error("Error al buscar alumno");
        return response.json();
    })
    .then (data => {
    document.getElementById("IdAlumnoEditar").value = data.alumnoId;
    document.getElementById("NombreEditar").value = data.nombreCompleto;
    document.getElementById("DniEditar").value = data.dni;
    document.getElementById("SexoEditar").value = data.sexo;
document.getElementById("DomicilioEditar").value = data.domicilio;

    var modal = new bootstrap.Modal(document.getElementById('ModalEditarAlumno'));
    modal.show();
})
    .catch(error => console.error("Error al buscar alumno:", error));
}

function EditarAlumno() {

    let nombre = document.getElementById("NombreEditar").value.trim();
    let dni = document.getElementById("DniEditar").value;
    let sexo = document.getElementById("SexoEditar").value;
    let domicilio = document.getElementById("DomicilioEditar").value.trim();

    if (nombre === "") {
        alert("El nombre es obligatorio");
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe tener 8 números");
        return;
    }

    if (sexo === "") {
        alert("Seleccione un sexo");
        return;
    }

    if (domicilio === "") {
        alert("El domicilio es obligatorio");
        return;
    }

    let alumno = {
        alumnoId: document.getElementById("IdAlumnoEditar").value,
        nombreCompleto: nombre,
        dni: parseInt(dni),
        sexo: parseInt(sexo),
        domicilio: domicilio
    };

    fetch(`https://localhost:7177/Alumno/${alumno.alumnoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno)
    })
    .then(response => {
        if (!response.ok && response.status !== 204) {
            throw new Error("Error al editar");
        }

        bootstrap.Modal.getInstance(document.getElementById('ModalEditarAlumno')).hide();

        ObtenerAlumnos();
    })
    .catch(error => console.error(error));
}


