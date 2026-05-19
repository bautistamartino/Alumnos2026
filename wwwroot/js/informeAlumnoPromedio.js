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
        getPromedioAlumnos();
    
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
    getPromedioAlumnos();
}

const inputFechaDesde = document.getElementById("FechaDesdeBuscar");
inputFechaDesde.onchange = function() {
    getPromedioAlumnos();
}

const inputFechaHasta = document.getElementById("FechaHastaBuscar");
inputFechaHasta.onchange = function() {
    getPromedioAlumnos();
}

async function getPromedioAlumnos() {
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
        asignaturaID: parseInt(document.getElementById("selectAsignatura").value)
    };

    console.log(filtros);

    const res = await fetch('https://localhost:7177/Informes/PromedioAlumnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtros)
    });
    
    const alumnos = await res.json();

    const tbody = document.querySelector("#tablaAlumnos tbody");
    tbody.innerHTML = "";

    alumnos.forEach((alumno) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${alumno.nombreCompleto}</td>
            <td class="text-center">${alumno.dni}</td>
            <td class="text-center">${alumno.promedio.toFixed(2)}</td>
        `;

        tbody.appendChild(row);
    });
}

ObtenerAsignaturas();
