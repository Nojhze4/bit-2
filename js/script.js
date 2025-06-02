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
      cards += `
<div class="flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <img src="https://github.com/${student.usernameGithub}.png" alt="Imagen de perfil de ${student.student}" onerror="this.onerror=null;this.src='not-found.png';">
      <h5 class="card-title">${student.student}</h5>
    </div>
    <div class="flip-card-back">
      <h5>${student.student}</h5>
      <a href="https://github.com/${student.usernameGithub}" target="_blank" rel="noopener noreferrer" class="card-link">Ver GitHub</a>
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
