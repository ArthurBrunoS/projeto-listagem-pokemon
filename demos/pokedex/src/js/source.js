"use strict";
const list = document.getElementById("listPokemon");
const form = document.getElementById("search-form");
const input = document.getElementById("searchInput");
const status = document.getElementById("status");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const pagination = document.querySelector(".pagination");
const pageLabel = document.getElementById("page-label");
const dialog = document.getElementById("pokemon-dialog");
const details = document.getElementById("pokemon-details");
const PAGE_SIZE = 24;
let offset = 0;
let count = 0;
let controller;
let requestId = 0;
let visiblePokemon = new Map();
let lastFocusedCard;

async function getJSON(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(response.status === 404
      ? "Pokémon não encontrado. Confira o nome ou número."
      : "Não foi possível consultar a PokeAPI. Tente novamente.");
  }
  return response.json();
}

function element(tag, text) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
}

function image(pokemon) {
  const node = element("img");
  const src = pokemon.sprites?.front_default;
  if (src) node.src = src;
  else node.hidden = true;
  node.alt = pokemon.name;
  node.loading = "lazy";
  return node;
}

function renderPokemon(pokemons) {
  const fragment = document.createDocumentFragment();
  visiblePokemon = new Map(pokemons.map(pokemon => [String(pokemon.id), pokemon]));
  for (const pokemon of pokemons) {
    const card = element("button");
    card.type = "button";
    card.className = "pokemon";
    card.dataset.id = String(pokemon.id);
    card.setAttribute("aria-label", "Ver detalhes de " + pokemon.name);
    card.append(element("small", "#" + String(pokemon.id).padStart(3, "0")), image(pokemon), element("strong", pokemon.name));
    fragment.append(card);
  }
  list.replaceChildren(fragment);
}

async function loadPokemon(query = "", targetOffset = offset) {
  controller?.abort();
  controller = new AbortController();
  const signal = controller.signal;
  const id = ++requestId;
  status.textContent = "Carregando Pokémon...";
  list.setAttribute("aria-busy", "true");
  list.replaceChildren();
  previous.disabled = true;
  next.disabled = true;
  pagination.hidden = Boolean(query);
  pageLabel.textContent = "";
  try {
    let pokemons;
    let total = count;
    if (query) {
      pokemons = [await getJSON("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(query), signal)];
    } else {
      const page = await getJSON("https://pokeapi.co/api/v2/pokemon?limit=" + PAGE_SIZE + "&offset=" + targetOffset, signal);
      total = page.count;
      pokemons = await Promise.all(page.results.map(item => getJSON(item.url, signal)));
    }
    if (id !== requestId) return;
    renderPokemon(pokemons);
    if (!query) {
      offset = targetOffset;
      count = total;
      pageLabel.textContent = "Página " + (offset / PAGE_SIZE + 1) + " de " + Math.ceil(count / PAGE_SIZE);
      previous.disabled = offset === 0;
      next.disabled = offset + PAGE_SIZE >= count;
    }
    status.textContent = pokemons.length + " Pokémon exibido(s). Selecione um para ver os detalhes.";
  } catch (error) {
    if (id !== requestId || error.name === "AbortError") return;
    status.textContent = error.name === "TypeError"
      ? "Sem conexão ou serviço indisponível. Confira sua internet e tente novamente."
      : error.message;
    // A failed page must remain retryable; offset changes only on success.
    if (!query) {
      previous.disabled = targetOffset === 0;
      next.disabled = count === 0 || targetOffset >= count;
    }
  } finally {
    if (id === requestId) list.setAttribute("aria-busy", "false");
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  loadPokemon(input.value.trim().toLowerCase(), 0);
});
document.getElementById("reset-search").addEventListener("click", () => {
  input.value = "";
  loadPokemon("", 0);
});
previous.addEventListener("click", () => loadPokemon("", Math.max(0, offset - PAGE_SIZE)));
next.addEventListener("click", () => loadPokemon("", offset + PAGE_SIZE));

list.addEventListener("click", event => {
  const card = event.target.closest("button[data-id]");
  if (!card) return;
  const pokemon = visiblePokemon.get(card.dataset.id);
  if (!pokemon) return;
  lastFocusedCard = card;
  const title = element("h2", pokemon.name);
  title.id = "details-title";
  const description = element("dl");
  const values = [
    ["Tipos", pokemon.types.map(item => item.type.name).join(", ")],
    ["Altura", pokemon.height / 10 + " m"],
    ["Peso", pokemon.weight / 10 + " kg"],
    ["Habilidades", pokemon.abilities.map(item => item.ability.name).join(", ")]
  ];
  for (const [label, value] of values) description.append(element("dt", label), element("dd", value));
  details.replaceChildren(title, image(pokemon), description);
  dialog.showModal();
});
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  if (lastFocusedCard?.isConnected) lastFocusedCard.focus();
});
loadPokemon("", 0);
