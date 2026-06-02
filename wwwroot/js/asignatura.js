let modoEdicionAsignatura = false;

ObtenerAsignaturas();

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

    $("#TodosLasAsignaturas").empty();

    $.each(data, function (index, asignatura) {

        $("#TodosLasAsignaturas").append(

            "<tr>" +

                "<td>" + asignatura.asignaturaId + "</td>" +
                "<td>" + asignatura.descripcion + "</td>" +
                "<td>" + (asignatura.eliminado ? "Sí" : "No") + "</td>" +

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
    });
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

        document.getElementById("Eliminado").checked =
            data.eliminado;

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

    let eliminado =
        document.getElementById("Eliminado").checked;

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

    let asignatura = {

        asignaturaId: id || 0,
        descripcion: descripcion,
        eliminado: eliminado
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

    document.getElementById("Eliminado").checked = false;

    document.getElementById("Descripcion")
    .classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR
document.getElementById('ModalAsignatura')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModalAsignatura();

});