let modoEdicionAsignatura = false;
let carrerasDisponibles = [];
let asignaturasDisponibles = [];

ObtenerAsignaturas();
ObtenerCarreras();

function ObtenerCarreras() {
    fetch('https://localhost:7177/Carrera')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las carreras");
            }

            return response.json();
        })
        .then(carreras => {
            carrerasDisponibles = carreras;
            const selector = document.getElementById('CarreraId');
            selector.innerHTML = '<option value="">Seleccione una carrera</option>';

            carreras
                .filter(carrera => !carrera.eliminado)
                .forEach(carrera => {
                    selector.add(new Option(carrera.descripcion, carrera.carreraId));
                });

            selector.addEventListener('change', ActualizarAniosCarrera);

            if (asignaturasDisponibles.length > 0) {
                MostrarAsignatura(asignaturasDisponibles);
            }
        })
        .catch(error => console.error(error));
}

function ActualizarAniosCarrera() {
    const carreraId = document.getElementById('CarreraId').value;
    const selectorAnio = document.getElementById('Año');
    const carrera = carrerasDisponibles.find(item => item.carreraId === parseInt(carreraId));

    selectorAnio.innerHTML = '<option value="">Seleccione un año</option>';
    selectorAnio.disabled = !carrera;

    if (!carrera) {
        selectorAnio.innerHTML = '<option value="">Seleccione primero una carrera</option>';
        return;
    }

    for (let anio = 1; anio <= carrera.duracion; anio++) {
        selectorAnio.add(new Option(`${anio}° año`, anio));
    }
}

function ObtenerAsignaturas() {

    fetch('https://localhost:7177/Asignatura')
    .then(response => {

        if (!response.ok)
            throw new Error("Error en la API");

        return response.json();
    })
    .then(data => MostrarAsignatura(data))
    .catch(error => console.error(error));
}

function MostrarAsignatura(data) {
    asignaturasDisponibles = data;

    $("#TodosLasAsignaturas").empty();

    const carrerasConAsignaturas = new Map();

    data.forEach(asignatura => {
        if (!carrerasConAsignaturas.has(asignatura.carreraId)) {
            carrerasConAsignaturas.set(asignatura.carreraId, []);
        }

        carrerasConAsignaturas.get(asignatura.carreraId).push(asignatura);
    });

    carrerasDisponibles
        .filter(carrera => !carrera.eliminado)
        .forEach(carrera => {
            const asignaturas = carrerasConAsignaturas.get(carrera.carreraId) || [];

            $("#TodosLasAsignaturas").append(
                `<tr class="bg-white text-dark">
                    <td colspan="5"><strong>${carrera.descripcion}</strong></td>
                </tr>`
            );

            asignaturas
                .sort(OrdenarAsignaturas)
                .forEach(asignatura => AgregarFilaAsignatura(asignatura));
            carrerasConAsignaturas.delete(carrera.carreraId);
        });

    carrerasConAsignaturas.forEach(asignaturas => {
        $("#TodosLasAsignaturas").append(
            `<tr class="bg-white text-dark">
                <td colspan="5"><strong>CARRERA NO ENCONTRADA</strong></td>
            </tr>`
        );

        asignaturas
            .sort(OrdenarAsignaturas)
            .forEach(asignatura => AgregarFilaAsignatura(asignatura));
    });
}

function OrdenarAsignaturas(primera, segunda) {
    const diferenciaDeAnio = primera.año - segunda.año;

    if (diferenciaDeAnio !== 0) {
        return diferenciaDeAnio;
    }

    return (primera.descripcion || '').localeCompare(
        segunda.descripcion || '',
        'es',
        { sensitivity: 'base' }
    );
}

function AgregarFilaAsignatura(asignatura) {
    $("#TodosLasAsignaturas").append(

        "<tr class='table-dark'>" +

            "<td>" + asignatura.asignaturaId + "</td>" +
            "<td>" + asignatura.descripcion + "</td>" +
            "<td>" + asignatura.año + "</td>" +

            "<td>" +
                "<button class='btn btn-info' onclick='BuscarAsignaturaId(" + asignatura.asignaturaId + ")'>" +
                    "Editar" +
                "</button>" +
            "</td>" +

            "<td>" +
                "<button class='btn btn-danger' onclick='EliminarAsignatura(" + asignatura.asignaturaId + ")'>" +
                    "Eliminar" +
                "</button>" +
            "</td>" +

        "</tr>"
    );
}

// ABRIR MODAL CREAR
function AbrirModalCrearAsignatura() {

    modoEdicionAsignatura = false;

    document.getElementById("TituloModalAsignatura").innerText =
        "Crear Asignatura";

    LimpiarModalAsignatura();

    const modal = new bootstrap.Modal(
        document.getElementById('ModalAsignatura')
    );

    modal.show();
}

// BUSCAR ASIGNATURA
function BuscarAsignaturaId(id) {

    fetch(`https://localhost:7177/Asignatura/${id}`)
    .then(response => {

        if (!response.ok)
            throw new Error("Error al buscar asignatura");

        return response.json();
    })
    .then(data => {

        modoEdicionAsignatura = true;

        document.getElementById("TituloModalAsignatura").innerText =
            "Editar Asignatura";

        document.getElementById("AsignaturaId").value =
            data.asignaturaId;

        document.getElementById("Descripcion").value =
            data.descripcion;

        document.getElementById("CarreraId").value =
            data.carreraId;

        ActualizarAniosCarrera();

        document.getElementById("Año").value =
            data.año;

        const modal = new bootstrap.Modal(
            document.getElementById('ModalAsignatura')
        );

        modal.show();
    })
    .catch(error => console.error(error));
}

// CREAR Y EDITAR
async function GuardarAsignatura() {

    let id = document.getElementById("AsignaturaId").value;

    let descripcion =
        document.getElementById("Descripcion").value.trim();

    let carreraId =
        document.getElementById("CarreraId").value;

    let año =
        document.getElementById("Año").value;

    // VALIDAR
    if (descripcion === "") {

        document.getElementById("Descripcion")
        .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'La descripción es obligatoria'
        });

        return;
    }
    else {
        document.getElementById("Descripcion")
            .classList.remove("is-invalid");
    }

    if (carreraId === "") {
        document.getElementById("CarreraId")
            .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar una carrera'
        });

        return;
    }
    else {
        document.getElementById("CarreraId")
            .classList.remove("is-invalid");
    }

    if (año === "") {
        document.getElementById("Año")
            .classList.add("is-invalid");

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar el año de la asignatura'
        });

        return;
    }
    else {
        document.getElementById("Año")
            .classList.remove("is-invalid");
    }

    let asignatura = {

        asignaturaId: id || 0,
        descripcion: descripcion,
        año: parseInt(año),
        carreraId: parseInt(carreraId),
        eliminado: false
    };

    let url = 'https://localhost:7177/Asignatura';
    let method = 'POST';

    if (modoEdicionAsignatura) {

        url += `/${id}`;
        method = 'PUT';
    }

    fetch(url, {

        method: method,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(asignatura)

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
        .getInstance(document.getElementById('ModalAsignatura'))
        .hide();

        ObtenerAsignaturas();

        LimpiarModalAsignatura();
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
function EliminarAsignatura(id) {

    if (!confirm("¿Seguro que desea eliminar esta asignatura?"))
        return;

    fetch(`https://localhost:7177/Asignatura/${id}`, {

        method: 'DELETE'
    })
    .then(response => {

        if (!response.ok)
            throw new Error("Error al eliminar");

    })
    .then(() => {

        ObtenerAsignaturas();
    })
    .catch(error => console.error(error));
}

// LIMPIAR MODAL
function LimpiarModalAsignatura() {

    document.getElementById("AsignaturaId").value = "";

    document.getElementById("Descripcion").value = "";

    document.getElementById("Descripcion")
    .classList.remove("is-invalid");

    document.getElementById("CarreraId").value = "";

    document.getElementById("Año").innerHTML =
        '<option value="">Seleccione primero una carrera</option>';

    document.getElementById("Año").disabled = true;

    document.getElementById("CarreraId")
    .classList.remove("is-invalid");

    document.getElementById("Año")
    .classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR
document.getElementById('ModalAsignatura')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModalAsignatura();

});