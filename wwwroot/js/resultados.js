function cargarResultados() {
    fetch('https://localhost:7177/Resultados') // ⚠️ cambiá el puerto si es necesario
    .then(response => response.json())
    .then(data => {
        let tabla = document.getElementById("TodosLosResultados");
        tabla.innerHTML = ""; // limpiar

        let fila = `
            <tr>
                <td>${data.promedio}</td>
                <td>${data.notaMasAlta}</td>
                <td>${data.alumnoNotaMasAlta ?? "N/A"}</td>
                <td>${data.notaMasBaja}</td>
                <td>${data.alumnoNotaMasBaja ?? "N/A"}</td>
                <td>
                    Aprobados: ${data.cantidadAprobados} <br>
                    Desaprobados: ${data.cantidadDesaprobados}
                </td>
                <td>${data.estadoDelGrupo}</td>
            </tr>
        `;

        tabla.innerHTML = fila;
    })
    .catch(error => {
        console.error("Error al cargar resultados:", error);
    });
}

window.onload = cargarResultados;