let modoEdicionDocente = false;
const apiDocente = 'https://localhost:7177/Docente';
const apiAsignatura = 'https://localhost:7177/Asignatura';

ObtenerDocentes();

function ObtenerDocentes() {

    fetch('https://localhost:7177/Docente')
    .then(response => {

        if (!response.ok)
            throw new Error("Error en la API");

        return response.json();
    })
    .then(data => MostrarDocente(data))
    .catch(error => console.error(error));
}

function MostrarDocente(data) {

    $("#TodosLosDocentes").empty();

    $.each(data, function (index, docente) {

        let sexos = {

            1: "Masculino",
            2: "Femenino",
            3: "Otro"
        };

        let sexoTexto =
            sexos[parseInt(docente.sexo)] || "Sin definir";

        $("#TodosLosDocentes").append(

            "<tr>" +

                "<td>" + docente.docenteId + "</td>" +
                "<td>" + docente.nombreCompleto + "</td>" +
                "<td>" + docente.dni + "</td>" +
                "<td>" + sexoTexto + "</td>" +
                "<td>" + docente.email + "</td>" +

                "<td>" +
                    "<button class='btn btn-info' onclick='BuscarDocenteId(" + docente.docenteId + ")'>" +
                        "Editar" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-danger' onclick='EliminarDocente(" + docente.docenteId + ")'>" +
                        "Eliminar" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-warning' onclick='HistorialDocente(" + docente.docenteId + ")'>" +
                        "Historial" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-primary' onclick='AbrirAsignaturasDocente(" + docente.docenteId + ", " + JSON.stringify(docente.nombreCompleto) + ")'>" +
                        "Asignaturas" +
                    "</button>" +
                "</td>" +

            "</tr>"
        );
    });
}

async function AbrirAsignaturasDocente(docenteId, nombreDocente) {
    document.getElementById('DocenteAsignaturasId').value = docenteId;
    document.getElementById('NombreDocenteAsignaturas').textContent = nombreDocente;

    try {
        const [asignaturasRespuesta, asignadasRespuesta] = await Promise.all([
            fetch(apiAsignatura),
            fetch(`${apiDocente}/${docenteId}/asignaturas`)
        ]);

        if (!asignaturasRespuesta.ok || !asignadasRespuesta.ok) {
            throw new Error('No se pudieron obtener las asignaturas del docente.');
        }

        const [asignaturas, asignadas] = await Promise.all([
            asignaturasRespuesta.json(),
            asignadasRespuesta.json()
        ]);

        const idsAsignados = new Set(asignadas.map(asignatura => asignatura.asignaturaId));
        const selector = document.getElementById('AsignaturaParaDocente');
        selector.innerHTML = '<option value="">Seleccione una asignatura</option>';

        asignaturas
            .filter(asignatura => !asignatura.eliminado && !idsAsignados.has(asignatura.asignaturaId))
            .forEach(asignatura => {
                selector.add(new Option(asignatura.descripcion, asignatura.asignaturaId));
            });

        MostrarAsignaturasDocente(asignadas);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('ModalAsignaturasDocente')).show();
    }
    catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

function MostrarAsignaturasDocente(asignaturas) {
    const cuerpo = document.getElementById('AsignaturasDelDocente');
    cuerpo.innerHTML = '';

    if (asignaturas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="3" class="text-center">No tiene asignaturas asignadas.</td></tr>';
        return;
    }

    asignaturas.forEach(asignatura => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${asignatura.descripcion}</td>
            <td><button class="btn btn-sm btn-danger" onclick="QuitarAsignaturaDocente(${asignatura.asignaturaId})">Quitar</button></td>
        `;
        cuerpo.appendChild(fila);
    });
}

async function AgregarAsignaturaDocente() {
    const docenteId = document.getElementById('DocenteAsignaturasId').value;
    const asignaturaId = document.getElementById('AsignaturaParaDocente').value;

    if (!asignaturaId) {
        Swal.fire({ icon: 'warning', title: 'Seleccione una asignatura' });
        return;
    }

    try {
        const respuesta = await fetch(`${apiDocente}/${docenteId}/asignaturas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asignaturaID: parseInt(asignaturaId) })
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.mensaje || 'No se pudo asignar la asignatura.');
        }

        await AbrirAsignaturasDocente(docenteId, document.getElementById('NombreDocenteAsignaturas').textContent);
    }
    catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

async function QuitarAsignaturaDocente(asignaturaId) {
    const docenteId = document.getElementById('DocenteAsignaturasId').value;

    if (!confirm('¿Seguro que desea quitar esta asignatura?')) {
        return;
    }

    try {
        const respuesta = await fetch(`${apiDocente}/${docenteId}/asignaturas/${asignaturaId}`, { method: 'DELETE' });

        if (!respuesta.ok) {
            throw new Error('No se pudo quitar la asignatura.');
        }

        await AbrirAsignaturasDocente(docenteId, document.getElementById('NombreDocenteAsignaturas').textContent);
    }
    catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

// SOLO NÚMEROS DNI
const dnicrear = document.getElementById("Dni");

dnicrear.addEventListener("input", function () {

    this.value =
        this.value.replace(/\D/g, "").slice(0, 8);
});

// ABRIR MODAL CREAR
function AbrirModalCrearDocente() {

    modoEdicionDocente = false;

    document.getElementById("TituloModalDocente").innerText =
        "Crear Docente";

    LimpiarModalDocente();

    const modal = new bootstrap.Modal(
        document.getElementById('ModalDocente')
    );

    modal.show();
}

// BUSCAR DOCENTE
function BuscarDocenteId(id) {

    fetch(`https://localhost:7177/Docente/${id}`)
    .then(response => {

        if (!response.ok)
            throw new Error("Error al buscar docente");

        return response.json();
    })
    .then(data => {

        modoEdicionDocente = true;

        document.getElementById("TituloModalDocente").innerText =
            "Editar Docente";

        document.getElementById("DocenteId").value =
            data.docenteId;

        document.getElementById("Nombre").value =
            data.nombreCompleto;

        document.getElementById("Dni").value =
            data.dni;

        document.getElementById("Sexo").value =
            data.sexo;

        document.getElementById("Email").value =
            data.email;

        const modal = new bootstrap.Modal(
            document.getElementById('ModalDocente')
        );

        modal.show();
    })
    .catch(error => console.error(error));
}

// CREAR Y EDITAR
async function GuardarDocente() {

    let id = document.getElementById("DocenteId").value;

    let nombre =
        document.getElementById("Nombre").value.trim();

    let dni =
        document.getElementById("Dni").value;

    let sexo =
        document.getElementById("Sexo").value;

    let email =
        document.getElementById("Email").value.trim();

    // VALIDAR NOMBRE
    if (nombre === "") {

        document.getElementById("Nombre")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El nombre es obligatorio'
        });

        return;
    }
    else {

        document.getElementById("Nombre")
        .classList.remove("is-invalid");
    }

    // VALIDAR DNI
    if (!/^\d{8}$/.test(dni)) {

        document.getElementById("Dni")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'error',
            title: 'DNI inválido',
            text: 'El DNI debe tener 8 números'
        });

        return;
    }
    else {

        document.getElementById("Dni")
        .classList.remove("is-invalid");
    }

    // VALIDAR SEXO
    if (sexo === "") {

        document.getElementById("Sexo")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar un sexo'
        });

        return;
    }
    else {

        document.getElementById("Sexo")
        .classList.remove("is-invalid");
    }

    // VALIDAR EMAIL
    if (email === "") {

        document.getElementById("Email")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El email es obligatorio'
        });

        return;
    }
    else {

        document.getElementById("Email")
        .classList.remove("is-invalid");
    }

    let docente = {

        docenteId: id || 0,
        nombreCompleto: nombre,
        dni: dni,
        sexo: parseInt(sexo),
        email: email
    };

    let url = 'https://localhost:7177/Docente';
    let method = 'POST';

    if (modoEdicionDocente) {

        url += `/${id}`;
        method = 'PUT';
    }

    fetch(url, {

        method: method,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(docente)

    })
    .then(async response => {

        if (!response.ok && response.status !== 204) {

            let errorMessage = "Error al guardar";

            try {

                const errorData = await response.json();

                errorMessage =
                    errorData.mensaje ||
                    errorData.title ||
                    errorMessage;
            }
            catch { }

            throw new Error(errorMessage);
        }

        bootstrap.Modal
        .getInstance(document.getElementById('ModalDocente'))
        .hide();

        ObtenerDocentes();

        LimpiarModalDocente();
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
function EliminarDocente(id) {

    if (!confirm("¿Seguro que desea eliminar este docente?"))
        return;

    fetch(`https://localhost:7177/Docente/${id}`, {

        method: 'DELETE'
    })
    .then(response => {

        if (!response.ok)
            throw new Error("Error al eliminar");

    })
    .then(() => {

        ObtenerDocentes();
    })
    .catch(error => console.error(error));
}

// HISTORIAL
async function HistorialDocente(id) {

    try {

        const respuesta = await fetch(
            `https://localhost:7177/Informes/historialdocente/${id}`
        );

        if (!respuesta.ok) {

            throw new Error(
                'Error al obtener el historial del docente'
            );
        }

        const historia = await respuesta.json();

        const bodyDocentes =
            document.getElementById('Tbody-historial-docente');

        bodyDocentes.innerHTML = '';

        historia.forEach((notas) => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${notas.fechaCambioString}</td>
                <td>${notas.campoModificado}</td>
                <td>${notas.valorAnterior}</td>
                <td>${notas.valorNuevo}</td>
            `;

            bodyDocentes.appendChild(tr);
        });

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('ModalHistorialDocente')
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
function LimpiarModalDocente() {

    document.getElementById("DocenteId").value = "";

    document.getElementById("Nombre").value = "";

    document.getElementById("Dni").value = "";

    document.getElementById("Sexo").value = "";

    document.getElementById("Email").value = "";

    document.getElementById("Nombre")
    .classList.remove("is-invalid");

    document.getElementById("Dni")
    .classList.remove("is-invalid");

    document.getElementById("Sexo")
    .classList.remove("is-invalid");

    document.getElementById("Email")
    .classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR
document.getElementById('ModalDocente')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModalDocente();

});