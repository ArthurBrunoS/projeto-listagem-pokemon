"use strict";
const formSkill = document.querySelector(".form-skill");
const inputSkill = document.getElementById("novo-skill");
const listaSkills = document.querySelector(".lista-skills");
const skillsPadrao = ["HTML", "CSS", "JavaScript", "Flexbox", "Responsividade", "DOM", "Git"];
let skills = [...skillsPadrao];
const storageFeedback = document.createElement("p");
storageFeedback.setAttribute("role", "status");
formSkill.after(storageFeedback);

try {
  const saved = localStorage.getItem("skills");
  if (saved !== null) {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.some(skill => typeof skill !== "string")) throw new Error("Dados inválidos");
    skills = [...new Set(parsed.map(skill => skill.trim()).filter(Boolean))].slice(0, 30).map(skill => skill.slice(0, 50));
  }
} catch {
  storageFeedback.textContent = "Não foi possível recuperar as competências salvas. Exibindo a lista inicial.";
}

function renderizarSkills() {
  const items = skills.map(skill => {
    const item = document.createElement("li");
    item.textContent = skill;
    return item;
  });
  listaSkills.replaceChildren(...items);
}
formSkill.addEventListener("submit", event => {
  event.preventDefault();
  const value = inputSkill.value.trim();
  if (!value || value.length > 50 || skills.length >= 30) {
    storageFeedback.textContent = "Use até 50 caracteres por competência e no máximo 30 competências.";
    return;
  }
  if (skills.some(skill => skill.toLocaleLowerCase("pt-BR") === value.toLocaleLowerCase("pt-BR"))) {
    storageFeedback.textContent = "Esta competência já está na lista.";
    return;
  }
  skills.push(value);
  renderizarSkills();
  try {
    localStorage.setItem("skills", JSON.stringify(skills));
    storageFeedback.textContent = "Competência salva neste navegador.";
  } catch {
    storageFeedback.textContent = "Competência adicionada apenas nesta sessão: armazenamento indisponível.";
  }
  formSkill.reset();
  inputSkill.focus();
});
renderizarSkills();
