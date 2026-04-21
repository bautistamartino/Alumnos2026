function ObtenerAsignaturas() {
fetch('https://localhost:7177/Asignatura')
.then(response => response.json())
.then(data => MostrarAsignatura(data))
.catch(error => console.error('Error: No se puede acceder al servicio', error));
}

function MostrarAsignatura(data) {
    $("#TodosLasAsignaturas").empty();

    $.each(data, function (index, asignatura) {
        $("#TodosLasAsignaturas").append(
            "<tr>" +
                "<td>" + asignatura.asignaturaId + "</td>" +
                "<td>" + asignatura.descripcion + "</td>" +
                "<td>" + (asignatura.eliminado ? "Sí" : "No") + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarAsignaturaId(" + asignatura.asignaturaId + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarAsignatura(" + asignatura.asignaturaId + ")'>Eliminar</button></td>" +
            "</tr>"
        );
    });
}

function CrearAsignatura() {
    let asignatura = {
        descripcion: document.getElementById("Descripcion").value,
        eliminado: document.getElementById("Eliminado").checked
    };

    fetch('https://localhost:7177/Asignatura', {
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
        document.getElementById("Eliminado").checked = false;

        ObtenerAsignaturas(); 
    })
    .catch(error => console.log("Error al guardar asignatura:", error));
}

function EliminarAsignatura(id) {
    if (!confirm("¿Seguro que desea eliminar esta asignatura?")) return;

    fetch(`https://localhost:7177/Asignatura/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return; // NO json()
    })
    .then(() => {
        ObtenerAsignaturas(); 
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function BuscarAsignaturaId(id) {
    fetch(`https://localhost:7177/Asignatura/${id}`)
    .then(response => {
        if (!response.ok) throw new Error("Error al buscar asignatura");
        return response.json();
    })
    .then(data => {
        document.getElementById("IdAsignaturaEditar").value = data.asignaturaId;
        document.getElementById("DescripcionEditar").value = data.descripcion;
        document.getElementById("EliminadoEditar").checked = data.eliminado;

        var modal = new bootstrap.Modal(document.getElementById('ModalEditarAsignatura'));
        modal.show();
    })
    .catch(error => console.error("Error al buscar asignatura:", error));
}

function EditarAsignatura() {
    let asignatura = {
        asignaturaId: document.getElementById("IdAsignaturaEditar").value,
        descripcion: document.getElementById("DescripcionEditar").value,
        eliminado: document.getElementById("EliminadoEditar").checked
    };

    fetch(`https://localhost:7177/Asignatura/${asignatura.asignaturaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asignatura)
    })
    .then(response => {
        if (!response.ok && response.status !== 204) {
            throw new Error("Error al editar la asignatura");
        }

        document.getElementById("IdAsignaturaEditar").value = "";
        document.getElementById("DescripcionEditar").value = "";
        document.getElementById("EliminadoEditar").checked = false;

        var modal = bootstrap.Modal.getInstance(document.getElementById('ModalEditarAsignatura'));
        modal.hide();

        ObtenerAsignaturas();
    })
    .catch(error => console.log("Error al editar:", error));
}





