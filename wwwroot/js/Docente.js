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
                "<td>" + docente.email + "</td>" +
                "<td><button class='btn btn-info' onclick='BuscarDocenteId(" + docente.docenteId + ")'>Editar</button></td>" +
                "<td><button class='btn btn-danger' onclick='EliminarDocente(" + docente.docenteId + ")'>Eliminar</button></td>" +
                "<td><button class='btn btn-warning' onclick='HistorialDocente(" + docente.docenteId + ")'>Historial</button></td>" +
            "</tr>"
        );
    });
}

const dnicrear = document.getElementById("Dni");
dnicrear.addEventListener("input", function() {
    this.value = this.value.replace(/\D/g, "").slice(0, 8);
});

function CrearDocente() {

    let nombre = document.getElementById("Nombre").value.trim();
    let dni = document.getElementById("Dni").value;
    let sexo = document.getElementById("Sexo").value;
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


    let docente = {
        nombreCompleto: nombre,
        dni: dni,
        sexo: parseInt(sexo),
        email: document.getElementById("Email").value.trim()
    };

    fetch('https://localhost:7177/Docente', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(docente)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.mensaje || "Error al crear docente");
            });
        }
        return response.json();
    })
    .then(() => {

        bootstrap.Modal.getInstance(document.getElementById('ModalAgregarDocente')).hide();

        document.getElementById("Nombre").value = "";
        document.getElementById("Dni").value = "";
        document.getElementById("Sexo").value = "";
        document.getElementById("Email").value = "";

        ObtenerDocentes();
    })
        .catch(error => {
        alert(error.message); });
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
    document.getElementById("EmailEditar").value = data.email;

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
        dni: dni,
        sexo: parseInt(sexo),
        
    };

    

    fetch(`https://localhost:7177/Docente/${docente.docenteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docente)
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

        bootstrap.Modal.getInstance(document.getElementById('ModalEditarDocente')).hide();

        ObtenerDocentes();
    })
    .catch(error => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error al editar docente',
            text: error.message
        });
    });
}


async function HistorialDocente(id) {
    try {
        const respuesta = await fetch(`https://localhost:7177/Informes/historialdocente/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al obtener el historial del docente');
        }

        const historia = await respuesta.json();

        const bodyDocentes = document.getElementById('Tbody-historial-docente');
        bodyDocentes.innerHTML = '' ;


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

        const modalElement = document.getElementById('ModalHistorialDocente');

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.show();

    }
    catch (error) {

        console.error('Error:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el historial del docente'
        });
    }
}

// Limpiar modal de agregar docente cuando se cierra
    document.getElementById('ModalAgregarDocente').addEventListener('hidden.bs.modal', function() {
    document.getElementById("Nombre").value = "";
    document.getElementById("Dni").value = "";
    document.getElementById("Sexo").value = "";
    document.getElementById("Email").value = "";
    
    // Remover clases de validación
    document.getElementById("Nombre").classList.remove("is-invalid");
    document.getElementById("Dni").classList.remove("is-invalid");
    document.getElementById("Sexo").classList.remove("is-invalid");
    document.getElementById("Email").classList.remove("is-invalid");
});