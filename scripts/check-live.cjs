"use strict";
const base = "https://arthurbrunos.github.io/projeto-listagem-pokemon/";
const expected = require("../projetos/versoes.json");
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), cache: "no-store" });
  if (!response.ok) throw new Error(response.status + " " + url);
  return response;
}
async function verify() {
  const manifest = await (await get(base + "projetos/versoes.json")).json();
  if (JSON.stringify(manifest) !== JSON.stringify(expected)) throw new Error("A versão publicada ainda não corresponde a esta revisão.");
  const paths = ["", "projetos/", "demos/pokedex/", "demos/pokedex/src/index.html", "demos/portfolio/", "demos/calculadora/", "demos/blog/", "demos/blog/HTML/index.html", "demos/blog/HTML/categorias.html", "demos/blog/HTML/contato.html", "demos/blog/HTML/Sobre.html", "demos/mario/"];
  const assets = new Set();
  for (const path of paths) {
    const url = base + path;
    const response = await get(url);
    const html = await response.text();
    if (!/<html\b/i.test(html)) throw new Error("HTML esperado em " + url);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const target = new URL(match[1], url);
      if (target.origin === new URL(base).origin && /\.(?:css|js|png|jpg|gif)$/.test(target.pathname)) assets.add(target.href);
    }
    console.log("OK " + url);
  }
  for (const asset of assets) { await get(asset); console.log("ASSET OK " + asset); }
  console.log("Publicação verificada: " + paths.length + " páginas e " + assets.size + " recursos.");
}
(async () => {
  let lastError;
  for (let attempt = 1; attempt <= 18; attempt++) {
    try { await verify(); return; } catch (error) {
      lastError = error;
      console.log("Tentativa " + attempt + ": " + error.message);
      if (attempt < 18) await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  throw lastError;
})().catch(error => { console.error(error); process.exitCode = 1; });
