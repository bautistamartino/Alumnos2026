let modoEdicionNota = false;

ObtenerNotas();
CargarAlumnos();
CargarAsignaturas();

// OBTENER NOTAS
function ObtenerNotas() {

    fetch('https://localhost:7177/NotaAlumno')
    .then(response => {

        if (!response.ok)
            throw new Error("Error en la API");

        return response.json();
    })
    .then(data => MostrarNotas(data))
    .catch(error => console.error(error));
}

// MOSTRAR NOTAS
function MostrarNotas(data) {

    console.log(data);

    $("#TablaNotas").empty();

    data.forEach(n => {

        $("#TablaNotas").append(`

            <tr>

                <td>${n.notaAlumnoID}</td>

                <td>${n.alumno?.nombreCompleto ?? n.alumnoID}</td>

                <td>${n.asignatura?.descripcion ?? n.asignaturaID}</td>

                <td>${n.nota}</td>

                <td>
                    ${new Date(n.fecha)
                    .toLocaleDateString('es-AR')}
                </td>

                <td>
                    <button class="btn btn-info"
                            onclick="BuscarNota(${n.notaAlumnoID})">
                        Editar
                    </button>
                </td>

                <td>
                    <button class="btn btn-danger"
                            onclick="EliminarNota(${n.notaAlumnoID})">
                        Eliminar
                    </button>
                </td>

                <td>
                    <button class="btn btn-warning"
                            onclick="HistorialNota(${n.notaAlumnoID})">
                        Historial
                    </button>
                </td>

            </tr>
        `);
    });
}

// CARGAR ALUMNOS
function CargarAlumnos() {

    fetch('https://localhost:7177/Alumno')
    .then(r => r.json())
    .then(data => {

        let select = $("#AlumnoId");

        select.empty();

        select.append(`
            <option value="">
                Seleccione un alumno
            </option>
        `);

        data.forEach(a => {

            select.append(`
                <option value="${a.alumnoId}">
                    ${a.nombreCompleto}
                </option>
            `);
        });
    });
}

// CARGAR ASIGNATURAS
function CargarAsignaturas() {

    fetch('https://localhost:7177/Asignatura')
    .then(r => r.json())
    .then(data => {

        let select = $("#AsignaturaId");

        select.empty();

        select.append(`
            <option value="">
                Seleccione una asignatura
            </option>
        `);

        data.forEach(a => {

            select.append(`
                <option value="${a.asignaturaId}">
                    ${a.descripcion}
                </option>
            `);
        });
    });
}

// ABRIR MODAL CREAR
function AbrirModalCrearNota() {

    modoEdicionNota = false;

    document.getElementById("TituloModalNota").innerText =
        "Crear Nota";

    LimpiarModalNota();

    const modal = new bootstrap.Modal(
        document.getElementById('ModalNota')
    );

    modal.show();
}

// BUSCAR NOTA
function BuscarNota(id) {

    fetch(`https://localhost:7177/NotaAlumno/${id}`)
    .then(r => r.json())
    .then(n => {

        modoEdicionNota = true;

        document.getElementById("TituloModalNota").innerText =
            "Editar Nota";

        document.getElementById("NotaAlumnoId").value =
            n.notaAlumnoID;

        document.getElementById("AlumnoId").value =
            n.alumnoID;

        document.getElementById("AsignaturaId").value =
            n.asignaturaID;

        document.getElementById("Nota").value =
            n.nota;

        document.getElementById("Fecha").value =
            n.fecha.split('T')[0];

        const modal = new bootstrap.Modal(
            document.getElementById('ModalNota')
        );

        modal.show();
    });
}

// GUARDAR
async function GuardarNota() {

    let id =
        document.getElementById("NotaAlumnoId").value;

    let alumnoId =
        document.getElementById("AlumnoId").value;

    let asignaturaId =
        document.getElementById("AsignaturaId").value;

    let nota =
        document.getElementById("Nota").value;

    let fecha =
        document.getElementById("Fecha").value;

    // VALIDAR ALUMNO
    if (!alumnoId) {

        document.getElementById("AlumnoId")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debe seleccionar un alumno'
        });

        return;
    }
    else {

        document.getElementById("AlumnoId")
        .classList.remove("is-invalid");
    }

    // VALIDAR ASIGNATURA
    if (!asignaturaId) {

        document.getElementById("AsignaturaId")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta seleccionar',
            text: 'Debe seleccionar una asignatura'
        });

        return;
    }
    else {

        document.getElementById("AsignaturaId")
        .classList.remove("is-invalid");
    }

    // VALIDAR NOTA
    if (!/^\d{1,2}$/.test(nota) ||
        nota < 1 ||
        nota > 10) {

        document.getElementById("Nota")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'error',
            title: 'Nota inválida',
            text: 'La nota debe estar entre 1 y 10'
        });

        return;
    }
    else {

        document.getElementById("Nota")
        .classList.remove("is-invalid");
    }

    // VALIDAR FECHA
    if (!fecha) {

        document.getElementById("Fecha")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Falta fecha',
            text: 'Debe seleccionar una fecha'
        });

        return;
    }
    else {

        document.getElementById("Fecha")
        .classList.remove("is-invalid");
    }

    let obj = {

        notaAlumnoID: id || 0,

        alumnoID: parseInt(alumnoId),

        asignaturaID: parseInt(asignaturaId),

        nota: parseInt(nota),

        fecha: fecha
    };

    let url =
        'https://localhost:7177/NotaAlumno';

    let method = 'POST';

    if (modoEdicionNota) {

        url += `/${id}`;

        method = 'PUT';
    }

    fetch(url, {

        method: method,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(obj)
    })
    .then(async response => {

        if (!response.ok &&
            response.status !== 204) {

            throw new Error("Error al guardar");
        }

        bootstrap.Modal
        .getInstance(document.getElementById('ModalNota'))
        .hide();

        ObtenerNotas();

        LimpiarModalNota();
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
function EliminarNota(id) {

    if (!confirm("¿Eliminar nota?"))
        return;

    fetch(`https://localhost:7177/NotaAlumno/${id}`, {

        method: 'DELETE'
    })
    .then(() => ObtenerNotas())
    .catch(error => console.error(error));
}

// HISTORIAL
async function HistorialNota(id) {

    try {

        const respuesta = await fetch(
            `https://localhost:7177/Informes/historialnota/${id}`
        );

        if (!respuesta.ok) {

            throw new Error(
                'Error al obtener historial'
            );
        }

        const historia = await respuesta.json();

        const bodyNotas =
            document.getElementById(
                'Tbody-historial-notas'
            );

        bodyNotas.innerHTML = '';

        historia.forEach((notas) => {

            const tr = document.createElement('tr');

            tr.innerHTML = `

                <td>${notas.fechaCambioString}</td>

                <td>${notas.campoModificado}</td>

                <td>${notas.valorAnterior}</td>

                <td>${notas.valorNuevo}</td>
            `;

            bodyNotas.appendChild(tr);
        });

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                document.getElementById(
                    'ModalHistorialNotaAlumno'
                )
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

// LIMPIAR
function LimpiarModalNota() {

    document.getElementById("NotaAlumnoId").value = "";

    document.getElementById("AlumnoId").value = "";

    document.getElementById("AsignaturaId").value = "";

    document.getElementById("Nota").value = "";

    document.getElementById("Fecha").value = "";

    document.getElementById("AlumnoId")
    .classList.remove("is-invalid");

    document.getElementById("AsignaturaId")
    .classList.remove("is-invalid");

    document.getElementById("Nota")
    .classList.remove("is-invalid");

    document.getElementById("Fecha")
    .classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR
document.getElementById('ModalNota')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModalNota();

});