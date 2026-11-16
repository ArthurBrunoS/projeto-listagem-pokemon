"use strict";
const themeButton = document.getElementById("botao-alterar-tema");
const themeImage = document.querySelector(".imagen-botao");
function applyTheme(dark) {
  document.body.classList.toggle("modo-escuro", dark);
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
  themeImage.src = dark ? "./src/imagens/moon.png" : "./src/imagens/sun.png";
  themeImage.alt = "";
}
let theme = null;
try { theme = localStorage.getItem("pokemon-theme"); } catch { /* Optional storage. */ }
applyTheme(theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
themeButton.addEventListener("click", () => {
  const dark = !document.body.classList.contains("modo-escuro");
  applyTheme(dark);
  try { localStorage.setItem("pokemon-theme", dark ? "dark" : "light"); } catch { /* Theme still works. */ }
});
const form = document.getElementById("pokemon-filter");
const search = document.getElementById("pokemon-search");
const type = document.getElementById("pokemon-type");
const cards = [...document.querySelectorAll(".cartao-pokemon")];
function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function filterPokemon() {
  const query = normalize(search.value);
  let count = 0;
  for (const card of cards) {
    const name = normalize(card.querySelector(".informacoes span").textContent);
    const types = [...card.querySelectorAll(".tipo")].map(item => normalize(item.textContent));
    const show = name.includes(query) && (!type.value || types.includes(type.value));
    card.hidden = !show;
    if (show) count++;
  }
  document.getElementById("filter-status").textContent = count ? count + " Pokémon encontrado(s)." : "Nenhum Pokémon encontrado.";
}
form.addEventListener("submit", event => { event.preventDefault(); filterPokemon(); });
search.addEventListener("input", filterPokemon);
type.addEventListener("change", filterPokemon);
form.addEventListener("reset", event => {
  event.preventDefault();
  search.value = "";
  type.value = "";
  filterPokemon();
});
filterPokemon();
