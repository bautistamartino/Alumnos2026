let modoEdicionCarrera = false;

ObtenerCarreras();

function ObtenerCarreras() {

    fetch('https://localhost:7177/Carrera')
    .then(response => {

        if (!response.ok)
            throw new Error("Error en la API");

        return response.json();
    })
    .then(data => MostrarCarreras(data))
    .catch(error => console.error(error));
}

function MostrarCarreras(data) {

    $("#TodasLasCarreras").empty();

    $.each(data, function (index, carrera) {

        $("#TodasLasCarreras").append(

            "<tr>" +

                "<td>" + carrera.carreraId + "</td>" +
                "<td>" + carrera.descripcion + "</td>" +
                "<td>" + carrera.duracion + "</td>" +

                "<td>" +
                    "<button class='btn btn-info' onclick='BuscarCarreraId(" + carrera.carreraId + ")'>" +
                        "Editar" +
                    "</button>" +
                "</td>" +

                "<td>" +
                    "<button class='btn btn-danger' onclick='EliminarCarrera(" + carrera.carreraId + ")'>" +
                        "Eliminar" +
                    "</button>" +
                "</td>" +

            "</tr>"
        );
    });
}

// ABRIR MODAL CREAR
function AbrirModalCrearCarrera() {

    modoEdicionCarrera = false;

    document.getElementById("TituloModalCarrera").innerText =
        "Crear Carrera";

    LimpiarModalCarrera();

    const modal = new bootstrap.Modal(
        document.getElementById('ModalCarrera')
    );

    modal.show();
}

// BUSCAR CARRERA
function BuscarCarreraId(id) {

    fetch(`https://localhost:7177/Carrera/${id}`)
    .then(response => {

        if (!response.ok)
            throw new Error("Error al buscar carrera");

        return response.json();
    })
    .then(data => {

        modoEdicionCarrera = true;

        document.getElementById("TituloModalCarrera").innerText =
            "Editar Carrera";

        document.getElementById("CarreraId").value =
            data.carreraId;

        document.getElementById("DescripcionCarrera").value =
            data.descripcion;

        document.getElementById("DuracionCarrera").value =
            data.duracion;

        const modal = new bootstrap.Modal(
            document.getElementById('ModalCarrera')
        );

        modal.show();
    })
    .catch(error => console.error(error));
}

// CREAR Y EDITAR
async function GuardarCarrera() {

    let id = document.getElementById("CarreraId").value;

    let descripcion =
        document.getElementById("DescripcionCarrera").value.trim();

    let duracion = Number(
        document.getElementById("DuracionCarrera").value
    );

    // VALIDAR
    if (descripcion === "" || !Number.isInteger(duracion) || duracion < 1) {

        if (descripcion === "") {
            document.getElementById("DescripcionCarrera")
            .classList.add("is-invalid");
        }

        if (!Number.isInteger(duracion) || duracion < 1) {
            document.getElementById("DuracionCarrera")
            .classList.add("is-invalid");
        }

        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'La descripción y la duración son obligatorias. La duración debe ser un número entero mayor que cero.'
        });

        return;
    }
    else {

        document.getElementById("DescripcionCarrera")
        .classList.remove("is-invalid");

        document.getElementById("DuracionCarrera")
        .classList.remove("is-invalid");
    }

    let carrera = {

        carreraId: id || 0,
        descripcion: descripcion,
        duracion: duracion,
        eliminado: false
    };

    let url = 'https://localhost:7177/Carrera';
    let method = 'POST';

    if (modoEdicionCarrera) {

        url += `/${id}`;
        method = 'PUT';
    }

    fetch(url, {

        method: method,

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(carrera)

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
        .getInstance(document.getElementById('ModalCarrera'))
        .hide();

        ObtenerCarreras();

        LimpiarModalCarrera();
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
function EliminarCarrera(id) {

    if (!confirm("¿Seguro que desea eliminar esta carrera?"))
        return;

    fetch(`https://localhost:7177/Carrera/${id}`, {

        method: 'DELETE'
    })
    .then(response => {

        if (!response.ok)
            throw new Error("Error al eliminar carrera");

    })
    .then(() => {

        ObtenerCarreras();
    })
    .catch(error => console.error(error));
}

// LIMPIAR MODAL
function LimpiarModalCarrera() {

    document.getElementById("CarreraId").value = "";

    document.getElementById("DescripcionCarrera").value = "";

    document.getElementById("DuracionCarrera").value = "";

    document.getElementById("DescripcionCarrera")
    .classList.remove("is-invalid");

    document.getElementById("DuracionCarrera")
    .classList.remove("is-invalid");
}

// LIMPIAR AL CERRAR
document.getElementById('ModalCarrera')
.addEventListener('hidden.bs.modal', function () {

    LimpiarModalCarrera();

});