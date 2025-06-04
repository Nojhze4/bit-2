"use strict";

const documento = document;
const $raiz = documento.getElementById("root");
const $loader = document.getElementById("loader");

let estudiantesGlobal = [];
let paginaActual = 1;
const registrosPorPagina = 20;

function crearTarjetaEstudiante(estudiante) {
  // Imagen y enlace GitHub
  const rutaImagen = estudiante.usernameGithub
    ? `https://github.com/${estudiante.usernameGithub}.png`
    : "img/not-found.png";
  const enlaceGithub = estudiante.usernameGithub
    ? `<a href="https://github.com/${estudiante.usernameGithub}" target="_blank" rel="noopener noreferrer" class="card-link">Ver GitHub</a>`
    : `<span class="card-link" style="color:#fff;opacity:0.7;">Sin GitHub</span>`;

  // Proyectos
  let proyectosHTML = "<p><strong>Proyectos:</strong></p><ul>";
  if (estudiante.projects && estudiante.projects.length > 0) {
    estudiante.projects.forEach((proyecto) => {
      if (proyecto.name) {
        proyectosHTML += `<li>${proyecto.name} <span style="font-size:0.9em;color:#eee;">[${proyecto.score ? proyecto.score.join(", ") : ""}]</span></li>`;
      }
    });
  } else {
    proyectosHTML += "<li>Sin proyectos</li>";
  }
  proyectosHTML += "</ul>";

  return `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img src="${rutaImagen}" alt="Imagen de perfil de ${estudiante.student}" onerror="this.onerror=null;this.src='img/not-found.png';">
          <h5 class="card-title">${estudiante.student}</h5>
        </div>
        <div class="flip-card-back">
          <p><strong>Intensidad:</strong> ${estudiante.intensity || "N/A"}</p>
          <p><strong>Código:</strong> ${estudiante.code || "N/A"}</p>
          ${enlaceGithub}
          ${proyectosHTML}
        </div>
      </div>
    </div>
  `;
}

function mostrarTarjetas(estudiantes, pagina = 1) {
  if ($loader) $loader.style.display = "block";
  $raiz.innerHTML = "";

  setTimeout(() => {
    let inicio = (pagina - 1) * registrosPorPagina;
    let fin = inicio + registrosPorPagina;
    let estudiantesPagina = estudiantes.slice(inicio, fin);

    let tarjetas = '<div class="d-flex flex-wrap">';
    estudiantesPagina.forEach((estudiante) => {
      tarjetas += crearTarjetaEstudiante(estudiante);
    });
    tarjetas += "</div>";

    $raiz.innerHTML = tarjetas + crearPaginacion(estudiantes.length, pagina);
    if ($loader) $loader.style.display = "none";
  }, 300);
}

function crearPaginacion(total, paginaActual) {
  let totalPaginas = Math.ceil(total / registrosPorPagina);
  if (totalPaginas <= 1) return "";

  let paginacion = '<nav class="pagination" style="text-align:center;margin:20px 0;"><ul style="list-style:none;padding:0;">';
  for (let i = 1; i <= totalPaginas; i++) {
    paginacion += `<li style="display:inline;margin:0 5px;">
      <button onclick="cambiarPagina(${i})" ${i === paginaActual ? "disabled" : ""}>${i}</button>
    </li>`;
  }
  paginacion += "</ul></nav>";
  return paginacion;
}

window.cambiarPagina = function(nuevaPagina) {
  paginaActual = nuevaPagina;
  mostrarTarjetas(estudiantesGlobal, paginaActual);
};

fetch("file.json")
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud: " + respuesta.statusText);
    }
    return respuesta.json();
  })
  .then((datos) => {
    estudiantesGlobal = datos;
    mostrarTarjetas(estudiantesGlobal, paginaActual);
  })
  .catch((error) => {
    alert("Error: " + error);
  });