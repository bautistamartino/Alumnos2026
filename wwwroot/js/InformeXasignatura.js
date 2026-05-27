async function ObtenerAsignaturas() {
    
    const respuesta = await fetch('https://localhost:7177/Asignatura',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 
        
        const asignaturas = await respuesta.json();

        const comboSelect = document.querySelector("#selectAsignatura");
        comboSelect.innerHTML = "";

        let opciones = `<option value="0">[TODAS LAS ASIGNATURAS]</option>`;

        asignaturas.forEach((asignatura) =>{
            opciones += `<option value="${asignatura.asignaturaId}">${asignatura.descripcion}</option>`;
        });
        comboSelect.innerHTML = opciones;
        IniciarFechas();
        getPromedioasignaturas();
    
}

async function ObtenerAlumnos() {
    
    const respuesta = await fetch('https://localhost:7177/Alumno',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 
        
        const alumnos = await respuesta.json();

        const comboSelect = document.querySelector("#selectAlumno");
        comboSelect.innerHTML = "";

        let opciones = `<option value="0">[TODOS LOS ALUMNOS]</option>`;

        alumnos.forEach((alumno) =>{
            opciones += `<option value="${alumno.alumnoId}">${alumno.nombreCompleto}</option>`;
        });
        comboSelect.innerHTML = opciones;
        IniciarFechas();
        getPromedioasignaturas();
    
}

function IniciarFechas() {
    const hoy = new Date();

    const fechaDesde = hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, '0') + "-01";
        
    const fechaHasta = hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, '0') + "-" +
        String(hoy.getDate()).padStart(2, '0');
    
    document.getElementById("FechaDesdeBuscar").value = fechaDesde;
    document.getElementById("FechaHastaBuscar").value = fechaHasta;
}

const inputCategoria = document.getElementById("selectAsignatura");
inputCategoria.onchange = function() {
    getPromedioasignaturas();
}

const inputCategoriaAlumno = document.getElementById("selectAlumno");
inputCategoriaAlumno.onchange = function() {
    getPromedioasignaturas();
}

const inputFechaDesde = document.getElementById("FechaDesdeBuscar");
inputFechaDesde.onchange = function() {
    getPromedioasignaturas();
}

const inputFechaHasta = document.getElementById("FechaHastaBuscar");
inputFechaHasta.onchange = function() {
    getPromedioasignaturas();
}

async function getPromedioasignaturas() {
    let FechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let FechaHasta = document.getElementById("FechaHastaBuscar").value;

    const fecha1 = new Date(FechaDesde);
    const fecha2 = new Date(FechaHasta);

    if (fecha1 > fecha2) {
        FechaHasta = FechaDesde;
        document.getElementById("FechaHastaBuscar").value = FechaDesde;
    }

    const filtros = {
        fechaDesde: FechaDesde,
        fechaHasta: FechaHasta,
        asignaturaID: parseInt(document.getElementById("selectAsignatura").value) || 0,
        alumnoID: parseInt(document.getElementById("selectAlumno").value) || 0
    };


    const res = await fetch('https://localhost:7177/Informes/promedioasignaturas', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(filtros)
});

const asignaturas = await res.json();

const tbody = document.querySelector("#tablaasignatura tbody");
tbody.innerHTML = "";

asignaturas.forEach((asignatura) => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${asignatura.asignaturaNombre}</td>
        <td class="text-center">
            ${Number(asignatura.promedio || 0).toFixed(2)}
        </td>
    `;

    tbody.appendChild(row);
});
}

ObtenerAsignaturas();
ObtenerAlumnos();
