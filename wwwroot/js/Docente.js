function ObtenerDocentes() {
    fetch('https://localhost:7177/Docente')
    .then(response => {
        if (!response.ok) throw new Error("Error en la API");
        return response.json();
    })
    .then(data => MostrarDocente(data))
    .catch(error => console.error('Error real:', error));
}

function MostrarDocente(data) {
    $("#TodosLosDocentes").empty();

    $.each(data, function (index, docente) {

        let sexos = {
            1: "Masculino",
            2: "Femenino",
            3: "Otro"
        };

        let sexoTexto = sexos[parseInt(docente.sexo)] || "Sin definir";

        $("#TodosLosDocentes").append(
            "<tr>" +
                "<td>" + docente.docenteId + "</td>" +
                "<td>" + docente.nombreCompleto + "</td>" +
                "<td>" + docente.dni + "</td>" +
                "<td>" + sexoTexto + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarDocenteId(" + docente.docenteId + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarDocente(" + docente.docenteId + ")'>Eliminar</button></td>" +
            "</tr>"
        );
    });
}

function CrearDocente() {

    let nombre = document.getElementById("Nombre").value.trim();
    let dni = document.getElementById("Dni").value;
    let sexo = document.getElementById("Sexo").value;

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

    let docente = {
        nombreCompleto: nombre,
        dni: parseInt(dni),
        sexo: parseInt(sexo),
    };

    fetch('https://localhost:7177/Docente', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(docente)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al crear");
        return response.json();
    })
    .then(() => {

        bootstrap.Modal.getInstance(document.getElementById('ModalAgregarDocente')).hide();

        document.getElementById("Nombre").value = "";
        document.getElementById("Dni").value = "";
        document.getElementById("Sexo").value = "";

        ObtenerDocentes();
    })
    .catch(error => console.error(error));
}

function EliminarDocente(id) {
    if (!confirm("¿Seguro que desea eliminar este docente?")) return;

    fetch(`https://localhost:7177/Docente/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return; // NO json()
    })
    .then(() => {
        ObtenerDocentes(); 
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function BuscarDocenteId(id) {
    fetch(`https://localhost:7177/Docente/${id}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) throw new Error("Error al buscar docente");
        return response.json();
    })
    .then (data => {
    document.getElementById("IdDocenteEditar").value = data.docenteId;
    document.getElementById("NombreEditar").value = data.nombreCompleto;
    document.getElementById("DniEditar").value = data.dni;
    document.getElementById("SexoEditar").value = data.sexo;

    var modal = new bootstrap.Modal(document.getElementById('ModalEditarDocente'));
    modal.show();
})
    .catch(error => console.error("Error al buscar docente:", error));
}

function EditarDocente() {

    let nombre = document.getElementById("NombreEditar").value.trim();
    let dni = document.getElementById("DniEditar").value;
    let sexo = document.getElementById("SexoEditar").value;

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


    let docente = {
        docenteId: document.getElementById("IdDocenteEditar").value,
        nombreCompleto: nombre,
        dni: parseInt(dni),
        sexo: parseInt(sexo),
    };

    fetch(`https://localhost:7177/Docente/${docente.docenteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docente)
    })
    .then(response => {
        if (!response.ok && response.status !== 204) {
            throw new Error("Error al editar");
        }

        bootstrap.Modal.getInstance(document.getElementById('ModalEditarDocente')).hide();

        ObtenerDocentes();
    })
    .catch(error => console.error(error));
}


