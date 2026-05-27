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
                "<td>" + alumno.email + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarAlumnoId(" + alumno.alumnoId + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarAlumno(" + alumno.alumnoId + ")'>Eliminar</button></td>" +
                "<td><button class='btn btn-warning' onclick='HistorialAlumno(" + alumno.alumnoId + ")'>Historial</button></td>" +
            "</tr>"
        );
    });
}

const dnicrear = document.getElementById("Dni");
dnicrear.addEventListener("input", function() {
    this.value = this.value.replace(/\D/g, "").slice(0, 8);
});

function CrearAlumno() {

    let nombre = document.getElementById("Nombre").value.trim();
    let dni = document.getElementById("Dni").value;
    let sexo = document.getElementById("Sexo").value;
    let domicilio = document.getElementById("Domicilio").value.trim();
    let email = document.getElementById("Email").value.trim();

    // VALIDAR NOMBRE
    if (nombre === "") {
        document.getElementById("Nombre").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El nombre es obligatorio'
        });
        return;
    } else {
        document.getElementById("Nombre").classList.remove("is-invalid");
    }

    // VALIDAR DNI
    if (!/^\d{8}$/.test(dni)) {
        document.getElementById("Dni").classList.add("is-invalid");

        Swal.fire({
            icon: 'error',
            title: 'DNI inválido',
            text: 'El DNI debe tener 8 números'
        });
        return;
    } else {
        document.getElementById("Dni").classList.remove("is-invalid");
    }

    // VALIDAR SEXO
    if (!sexo) {
        document.getElementById("Sexo").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debe seleccionar un sexo'
        });
        return;
    } else {
        document.getElementById("Sexo").classList.remove("is-invalid");
    }

    if (domicilio === "") {
        document.getElementById("Domicilio").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El domicilio es obligatorio'
        });
        return;
    } else {
        document.getElementById("Domicilio").classList.remove("is-invalid");
    }

    if (email === "") {
        document.getElementById("Email").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El email es obligatorio'
        });
        return;
    } else {
        document.getElementById("Email").classList.remove("is-invalid");
    }


    let alumno = {
        nombreCompleto: nombre,
        dni: dni,
        sexo: parseInt(sexo),
        domicilio: domicilio,
        email: email
    };

    fetch('https://localhost:7177/Alumno', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(alumno)
    })
    .then(response => {

        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.mensaje || "Error al crear alumno");
            });
        }

        return response.json();
    })
    .then(() => {
        
        bootstrap.Modal.getInstance(document.getElementById('ModalAgregarAlumno')).hide();

        document.getElementById("Nombre").value = "";
        document.getElementById("Dni").value = "";
        document.getElementById("Sexo").value = "";
        document.getElementById("Domicilio").value = "";
        document.getElementById("Email").value = "";
        ObtenerAlumnos();
    })
    .catch(error => {
        alert(error.message); });
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
    document.getElementById("EmailEditar").value = data.email;    

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
        dni: dni,
        sexo: parseInt(sexo),
        domicilio: domicilio,
    };

    fetch(`https://localhost:7177/Alumno/${alumno.alumnoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno)
    })
    .then(async response => {
        if (!response.ok && response.status !== 204) {
            let errorMessage = 'Error al editar';
            try {
                const errorData = await response.json();
                errorMessage = errorData?.mensaje || errorData?.title || JSON.stringify(errorData);
            } catch {
                errorMessage = `Error al editar (código ${response.status})`;
            }
            throw new Error(errorMessage);
        }

        bootstrap.Modal.getInstance(document.getElementById('ModalEditarAlumno')).hide();

        ObtenerAlumnos();
    })
    .catch(error => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error al editar alumno',
            text: error.message
        });
    });
}

async function HistorialAlumno(id) {
    try {
        const respuesta = await fetch(`https://localhost:7177/Informes/historialalumno/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al obtener el historial del alumno');
        }

        const historia = await respuesta.json();

        const bodyAlumnos = document.getElementById('Tbody-historial-alumno');
        bodyAlumnos.innerHTML = '' ;
        

        historia.forEach((notas) => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${notas.fechaCambioString}</td>
                <td>${notas.campoModificado}</td>
                <td>${notas.valorAnterior}</td>
                <td>${notas.valorNuevo}</td>
            `;

            bodyAlumnos.appendChild(tr);
        });

        const modalElement = document.getElementById('ModalHistorialAlumno');

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.show();

    }
    catch (error) {

        console.error('Error:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el historial del alumno'
        });
    }
}

// Limpiar modal de agregar alumno cuando se cierra
    document.getElementById('ModalAgregarAlumno').addEventListener('hidden.bs.modal', function() {
    document.getElementById("Nombre").value = "";
    document.getElementById("Dni").value = "";
    document.getElementById("Sexo").value = "";
    document.getElementById("Domicilio").value = "";
    document.getElementById("Email").value = "";
    
    // Remover clases de validación
    document.getElementById("Nombre").classList.remove("is-invalid");
    document.getElementById("Dni").classList.remove("is-invalid");
    document.getElementById("Sexo").classList.remove("is-invalid");
    document.getElementById("Domicilio").classList.remove("is-invalid");
    document.getElementById("Email").classList.remove("is-invalid");
});

