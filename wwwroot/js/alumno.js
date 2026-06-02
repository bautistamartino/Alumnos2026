let modoEdicion = false;

ObtenerAlumnos();

function ObtenerAlumnos() {

    fetch('https://localhost:7177/Alumno')
    .then(response => {

        if (!response.ok)
            throw new Error("Error en la API");

        return response.json();
    })
    .then(data => MostrarAlumnos(data))
    .catch(error => console.error('Error:', error));
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

                "<td>" +
                    "<button class='btn btn-info' onclick='BuscarAlumnoId(" + alumno.alumnoId + ")'>" +
                        "Editar" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-danger' onclick='EliminarAlumno(" + alumno.alumnoId + ")'>" +
                        "Eliminar" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-warning' onclick='HistorialAlumno(" + alumno.alumnoId + ")'>" +
                        "Historial" +
                    "</button>" +
                "</td>" +

            "</tr>"
        );
    });
}

// SOLO NÚMEROS EN DNI
const dnicrear = document.getElementById("Dni");

dnicrear.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 8);
});

// ABRIR MODAL CREAR
function AbrirModalCrear() {

    modoEdicion = false;

    document.getElementById("TituloModal").innerText = "Crear Alumno";

    LimpiarModal();

    const modal = new bootstrap.Modal(document.getElementById('ModalAlumno'));

    modal.show();
}

// BUSCAR ALUMNO POR ID
function BuscarAlumnoId(id) {

    fetch(`https://localhost:7177/Alumno/${id}`)
    .then(response => {

        if (!response.ok)
            throw new Error("Error al buscar alumno");

        return response.json();
    })
    .then(data => {

        modoEdicion = true;

        document.getElementById("TituloModal").innerText = "Editar Alumno";

        document.getElementById("AlumnoId").value = data.alumnoId;
        document.getElementById("Nombre").value = data.nombreCompleto;
        document.getElementById("Dni").value = data.dni;
        document.getElementById("Sexo").value = data.sexo;
        document.getElementById("Domicilio").value = data.domicilio;
        document.getElementById("Email").value = data.email;

        const modal = new bootstrap.Modal(document.getElementById('ModalAlumno'));

        modal.show();
    })
    .catch(error => console.error(error));
}

// CREAR Y EDITAR
async function GuardarAlumno() {

    let id = document.getElementById("AlumnoId").value;

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
    }
    else {
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
    }
    else {
        document.getElementById("Dni").classList.remove("is-invalid");
    }

    // VALIDAR SEXO
    if (sexo === "") {

        document.getElementById("Sexo").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar un sexo'
        });

        return;
    }
    else {
        document.getElementById("Sexo").classList.remove("is-invalid");
    }

    // VALIDAR DOMICILIO
    if (domicilio === "") {

        document.getElementById("Domicilio").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El domicilio es obligatorio'
        });

        return;
    }
    else {
        document.getElementById("Domicilio").classList.remove("is-invalid");
    }

    // VALIDAR EMAIL
    if (email === "") {

        document.getElementById("Email").classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El email es obligatorio'
        });

        return;
    }
    else {
        document.getElementById("Email").classList.remove("is-invalid");
    }

    let alumno = {
        alumnoId: id || 0,
        nombreCompleto: nombre,
        dni: dni,
        sexo: parseInt(sexo),
        domicilio: domicilio,
        email: email
    };

    let url = 'https://localhost:7177/Alumno';
    let method = 'POST';

    if (modoEdicion) {

        url += `/${id}`;
        method = 'PUT';
    }

    fetch(url, {

        method: method,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(alumno)

    })
    .then(async response => {

        if (!response.ok && response.status !== 204) {

            let errorMessage = "Error";

            try {

                const errorData = await response.json();

                errorMessage =
                    errorData.mensaje ||
                    errorData.title ||
                    "Error al guardar alumno";
            }
            catch { }

            throw new Error(errorMessage);
        }

        bootstrap.Modal
            .getInstance(document.getElementById('ModalAlumno'))
            .hide();

        ObtenerAlumnos();

        LimpiarModal();
    })
    .catch(error => {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });

    });
}

// ELIMINAR
function EliminarAlumno(id) {

    if (!confirm("¿Seguro que desea eliminar este alumno?"))
        return;

    fetch(`https://localhost:7177/Alumno/${id}`, {
        method: 'DELETE'
    })
    .then(response => {

        if (!response.ok)
            throw new Error("Error al eliminar");

    })
    .then(() => {
        ObtenerAlumnos();
    })
    .catch(error => console.error(error));
}

// HISTORIAL
async function HistorialAlumno(id) {

    try {

        const respuesta = await fetch(
            `https://localhost:7177/Informes/historialalumno/${id}`
        );

        if (!respuesta.ok) {
            throw new Error();
        }

        const historia = await respuesta.json();

        const bodyAlumnos = document.getElementById('Tbody-historial-alumno');

        bodyAlumnos.innerHTML = '';

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

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('ModalHistorialAlumno')
        );

        modal.show();

    }
    catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el historial'
        });
    }
}

// LIMPIAR MODAL
function LimpiarModal() {

    document.getElementById("AlumnoId").value = "";
    document.getElementById("Nombre").value = "";
    document.getElementById("Dni").value = "";
    document.getElementById("Sexo").value = "";
    document.getElementById("Domicilio").value = "";
    document.getElementById("Email").value = "";

    document.getElementById("Nombre").classList.remove("is-invalid");
    document.getElementById("Dni").classList.remove("is-invalid");
    document.getElementById("Sexo").classList.remove("is-invalid");
    document.getElementById("Domicilio").classList.remove("is-invalid");
    document.getElementById("Email").classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR MODAL
document.getElementById('ModalAlumno')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModal();

});