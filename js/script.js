"use strict";
const d = document;
const $root = d.getElementById("root");

let cards = '<div class="d-flex flex-wrap">';

fetch("file.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Error en la respuesta de la red");
    }
    return res.json();
  })
  .then((info) => {
    info.forEach((student) => {
      // Imagen y enlace GitHub
      const imgSrc = student.usernameGithub
        ? `https://github.com/${student.usernameGithub}.png`
        : "not-found.png";
      const githubLink = student.usernameGithub
        ? `<a href="https://github.com/${student.usernameGithub}" target="_blank" rel="noopener noreferrer" class="card-link">Ver GitHub</a>`
        : `<span class="card-link" style="color:#fff;opacity:0.7;">Sin GitHub</span>`;

      // Proyectos
      let proyectosHTML = "<p><strong>Proyectos:</strong></p><ul>";
      if (student.projects && student.projects.length > 0) {
        student.projects.forEach((proj) => {
          if (proj.name) {
            proyectosHTML += `<li>${proj.name} <span style="font-size:0.9em;color:#eee;">[${proj.score ? proj.score.join(", ") : ""}]</span></li>`;
          }
        });
      } else {
        proyectosHTML += "<li>Sin proyectos</li>";
      }
      proyectosHTML += "</ul>";

     cards += `
<div class="flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <img src="${imgSrc}" alt="Imagen de perfil de ${student.student}" onerror="this.onerror=null;this.src='not-found.png';">
      <h5 class="card-title">${student.student}</h5>
    </div>
    <div class="flip-card-back">
      <p><strong>Intensidad:</strong> ${student.intensity || "N/A"}</p>
      <p><strong>Código:</strong> ${student.code || "N/A"}</p>
      ${githubLink}
      ${proyectosHTML}
    </div>
  </div>
</div>
`;
    });

    cards += "</div>";
    $root.innerHTML = cards;
  })
  .catch((err) => {
    alert("Error: " + err);
  });