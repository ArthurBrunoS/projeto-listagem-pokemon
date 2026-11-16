"use strict";
const usuarioGithub = "ArthurBrunoS";
const containerProjetos = document.querySelector(".projetos");
const demonstracoes = {"Pokedex":"https://arthurbrunos.github.io/projeto-listagem-pokemon/demos/pokedex/","Projeto_FrontEnd_Unicesumar":"https://arthurbrunos.github.io/projeto-listagem-pokemon/demos/blog/","JavaScrypt_Unicesumar":"https://arthurbrunos.github.io/projeto-listagem-pokemon/demos/portfolio/"};
const projetos = [
  { repo: "Pokedex", nome: "Pokédex", descricao: "Busca e listagem de Pokémon com integração à PokeAPI.", tecnologias: "HTML · CSS · JavaScript · API REST", cor: "projeto-1" },
  { repo: "Projeto_FrontEnd_Unicesumar", nome: "Blog de viagens e hobbies", descricao: "Blog com páginas de conteúdo, tema persistido e validação de formulário.", tecnologias: "HTML · CSS · JavaScript · localStorage", cor: "projeto-2", privado: true },
  { repo: "JavaScrypt_Unicesumar", nome: "Página pessoal", descricao: "Apresentação, seleção de projetos e competências salvas no navegador.", tecnologias: "HTML · CSS · JavaScript · API do GitHub", cor: "projeto-3" }
];

function renderizarProjetos() {
  const fragment = document.createDocumentFragment();
  for (const projeto of projetos) {
    const article = document.createElement("article");
    const cover = document.createElement("div");
    cover.className = "projeto-imagem " + projeto.cor;
    cover.setAttribute("aria-hidden", "true");
    const title = document.createElement("h3");
    title.textContent = projeto.nome;
    const description = document.createElement("p");
    description.textContent = projeto.descricao;
    const tech = document.createElement("p");
    tech.textContent = projeto.tecnologias;
    article.append(cover, title, description, tech);
    if (projeto.privado) {
      const note = document.createElement("p");
      note.textContent = "Repositório de desenvolvimento privado.";
      article.append(note);
    } else {
      const link = document.createElement("a");
      link.href = "https://github.com/" + usuarioGithub + "/" + projeto.repo;
      link.textContent = "Ver código de " + projeto.nome;
      article.append(link);
    }
    const demo = document.createElement("a");
    demo.href = demonstracoes[projeto.repo];
    demo.textContent = "Abrir demonstração de " + projeto.nome;
    article.append(demo);
    fragment.append(article);
  }
  containerProjetos.replaceChildren(fragment);
}

async function carregarPerfil() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resposta = await fetch("https://api.github.com/users/" + usuarioGithub, { signal: controller.signal });
    if (!resposta.ok) throw new Error("Perfil indisponível");
    const perfil = await resposta.json();
    document.querySelector("header h1").textContent = perfil.name || "Arthur Bruno";
    document.querySelector(".cargo").textContent = perfil.bio || "Estudante de Engenharia de Software";
    // The static avatar and identity remain visible if the API is unavailable.
  } catch {
    document.querySelector("header h1").textContent = "Arthur Bruno";
  } finally {
    clearTimeout(timeout);
  }
}
renderizarProjetos();
carregarPerfil();
