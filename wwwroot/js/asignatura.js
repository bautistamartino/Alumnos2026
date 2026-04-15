function ObtenerAsignaturas() {
fetch('https://localhost:7063/Asignatura')
.then(response => response.json())
.then(data => MostrarAsignatura(data))
.catch(error => console.error('Error: No se puede acceder al servicio', error));
}

function MostrarAsignatura(data) {
    $("#TodosLasAsignaturas").empty();
    $.each(data, function (index, asignatura) {
        $("#TodosLasAsignaturas").append(
            "<tr>" +
                "<td>" + asignatura.id + "</td>" +
                "<td>" + asignatura.descripcion + "</td>" +
                "<td>" + asignatura.eliminado + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarAsignaturaId(" + asignatura.id + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarAsignatura(" + asignatura.id + ")'>Eliminar</button></td>" +
            "</tr>"
        );
    });
}

function CrearAsignatura() {
  
    let asignatura = {
        descripcion: document.getElementById("Descripcion").value,
        eliminado: document.getElementById("Eliminado").value === "true",
    }

    fetch('https://localhost:7063/Asignatura', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(asignatura)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en el servidor");
        return response.json();
    })
    .then(() => {
        var modal = bootstrap.Modal.getInstance(document.getElementById('ModalAgregarAsignatura'));
        modal.hide();

        document.getElementById("Descripcion").value = "";
        document.getElementById("Eliminado").value = "";

        ObtenerAsignaturas(); // 🔥 actualizar tabla
    })
    .catch(error => console.log("Error al guardar asignatura:", error));
}


function EliminarAsignatura(id) {
    if (!confirm("¿Seguro que desea eliminar esta asignatura?")) return;

    fetch(`https://localhost:7063/Asignatura/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return; // NO json()
    })
    .then(() => {
        ObtenerAsignaturas(); // 🔥 actualiza tabla
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function BuscarAsignaturaId(id) {
    fetch(`https://localhost:7063/Asignatura/${id}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) throw new Error("Error al buscar asignatura");
        return response.json();
    })
    .then (data => {
        document.getElementById("IdAsignaturaEditar").value = data.id;
        document.getElementById("DescripcionEditar").value = data.descripcion;
        document.getElementById("EliminadoEditar").value = data.eliminado;
        var modal = new bootstrap.Modal(document.getElementById('ModalEditarAsignatura'));
modal.show();
    })
    .catch(error => console.error("Error al buscar asignatura:", error));
}

function EditarAsignatura() {
    let asignatura = {
        id: document.getElementById("IdAsignaturaEditar").value,
        descripcion: document.getElementById("DescripcionEditar").value,
        eliminado: document.getElementById("EliminadoEditar").checked,
    }
    fetch(`https://localhost:7063/Asignatura/${asignatura.id}`, {
    method: 'PUT',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(asignatura)
})
.then(response => {

    // Si no es OK y no es 204 → Error
    if (!response.ok && response.status !== 204) {
        throw new Error("Error al editar la asignatura");
    }

    // Si todo salió bien:
    document.getElementById("IdAsignaturaEditar").value = "";
    document.getElementById("DescripcionEditar").value = "";
    document.getElementById("EliminadoEditar").value = "";

    var modal = bootstrap.Modal.getInstance(document.getElementById('ModalEditarAsignatura'));
modal.hide();
    ObtenerAsignaturas();
})
        .catch(error => console.log("Hubo un error al editar la asignatura, verifique el mensaje error: ", error));


}





