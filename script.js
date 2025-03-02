const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGHkiD2swxAarO43f4T62b5howCSSaaYH-94Bm__0nXT0etnFjnucYLlkFxQkpyhbGePgrMdFv3opE/pub?gid=271811695&single=true&output=csv";

// Definir colores según contenido
const coloresCondicionales = {
    "Betania": "#F4CCCC",
    "Arroyo": "#FCE5CD",
    "Jerusalén": "#FFE599",
    "Acapulco": "#D9D2E9",
    "Almuerzo": "#FFFFFF",
    "Tareas": "#D9D9D9"
};

// Cargar los datos desde el CSV
async function cargarDatos() {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const datos = parseCSV(csvText);
    llenarTabla(datos);
}

// Convertir el CSV en una matriz
function parseCSV(texto) {
    return texto.trim().split("\n").map(fila => fila.split(","));
}

// Obtener el número del día actual (1 = Lunes, ..., 5 = Viernes)
function obtenerDiaActual() {
    let dia = new Date().getDay();
    return dia === 0 || dia > 5 ? null : dia; // Si es domingo (0) o sábado (6), no resaltar nada
}

// Llenar la tabla combinando celdas repetidas
function llenarTabla(datos) {
    const tabla = document.getElementById("tabla-horario");
    tabla.innerHTML = "";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    // Detectar el día actual
    const diaActual = obtenerDiaActual();

    datos[0].forEach((titulo, i) => {
        const th = document.createElement("th");
        th.textContent = titulo.trim();
        
        // Resaltar la columna del día actual
        if (i === diaActual) {
            th.classList.add("dia-actual");
        }

        trHead.appendChild(th);
    });

    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    const referencias = Array.from({ length: datos[0].length }, () => null);

    datos.slice(1).forEach((fila, i) => {
        const tr = document.createElement("tr");

        fila.forEach((celda, j) => {
            let contenido = celda.trim();

            if (referencias[j] && referencias[j].textContent === contenido) {
                referencias[j].rowSpan++;
            } else {
                const td = document.createElement("td");
                td.textContent = contenido;
                tr.appendChild(td);
                referencias[j] = td;

                // Aplicar color si el contenido coincide con el mapa de colores
                Object.keys(coloresCondicionales).forEach(key => {
                    if (contenido.includes(key)) {
                        td.style.backgroundColor = coloresCondicionales[key];
                    }
                });

                // Resaltar la columna del día actual
                if (j === diaActual) {
                    td.classList.add("dia-actual");
                }
            }
        });

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
}

// Iniciar la carga de datos
window.onload = cargarDatos;
