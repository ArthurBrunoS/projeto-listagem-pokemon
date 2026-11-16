"use strict";
const toggleButton = document.getElementById("dark-mode");
const body = document.body;
const preference = window.matchMedia("(prefers-color-scheme: dark)");
function savedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}
function applyTheme(dark) {
  body.classList.toggle("dark", dark);
  if (toggleButton) {
    toggleButton.textContent = dark ? "☀️" : "🌙";
    toggleButton.setAttribute("aria-pressed", String(dark));
    toggleButton.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
  }
}
applyTheme(savedTheme() ? savedTheme() === "dark" : preference.matches);
toggleButton?.addEventListener("click", () => {
  const dark = !body.classList.contains("dark");
  applyTheme(dark);
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch { /* Theme still works without storage. */ }
});
preference.addEventListener("change", event => { if (!savedTheme()) applyTheme(event.matches); });

// Reveal content immediately without requiring a successful animation.
document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
const backToTop = document.getElementById("back-to-top");
function updateTopButton() { backToTop?.classList.toggle("show", window.scrollY > 300); }
window.addEventListener("scroll", updateTopButton, { passive: true });
updateTopButton();
backToTop?.addEventListener("click", () => window.scrollTo({
  top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}));

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const searchForm = document.querySelector("#search-bar form");
if (searchForm) {
  const input = document.getElementById("blog-search");
  const posts = [...document.querySelectorAll(".post")];
  const params = new URLSearchParams(window.location.search);
  const category = params.get("categoria");
  const tag = params.get("tag");
  input.value = params.get("q") || "";
  function filter() {
    const query = normalize(input.value);
    let count = 0;
    posts.forEach(post => {
      const matches = (!category || post.dataset.categories.split(" ").includes(category))
        && (!tag || post.dataset.tags.split(" ").includes(tag))
        && normalize(post.textContent).includes(query);
      post.hidden = !matches;
      if (matches) count++;
    });
    document.getElementById("filter-status").textContent = count
      ? count + " relato(s) encontrado(s)." + (category || tag ? " Filtro: " + (category || tag) + "." : "")
      : "Nenhum relato encontrado. Limpe os filtros ou tente outra busca.";
  }
  searchForm.addEventListener("submit", event => { event.preventDefault(); filter(); });
  input.addEventListener("input", filter);
  document.getElementById("clear-filters").addEventListener("click", () => {
    window.location.assign("./index.html#posts-container");
  });
  filter();
}

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const fields = [[name, !name.value.trim()], [email, !email.validity.valid], [message, message.value.trim().length < 10]];
    fields.forEach(([input, invalid]) => {
      input.classList.toggle("error", invalid);
      input.setAttribute("aria-invalid", String(invalid));
    });
    const feedback = document.getElementById("form-message");
    if (fields.some(([, invalid]) => invalid)) {
      feedback.textContent = "Informe nome, e-mail válido e mensagem com pelo menos 10 caracteres.";
      feedback.className = "form-message error";
      fields.find(([, invalid]) => invalid)[0].focus();
      return;
    }
    feedback.textContent = "Validação concluída. Esta é uma demonstração: nenhuma mensagem foi enviada.";
    feedback.className = "form-message success";
    form.reset();
  });
}
const tipButton = document.getElementById("toggle-tip");
const tipBox = document.getElementById("tip-box");
tipButton?.addEventListener("click", () => {
  const open = tipBox.classList.toggle("active");
  tipButton.textContent = open ? "Ocultar dica" : "Mostrar dica";
  tipButton.setAttribute("aria-expanded", String(open));
});
