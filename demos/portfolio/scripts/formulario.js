"use strict";
const botaoMensagem = document.querySelector(".btn-mensagem");
const formularioContato = document.querySelector(".formulario-contato");
const feedback = document.querySelector(".feedback");
botaoMensagem.addEventListener("click", () => {
  const hidden = formularioContato.classList.toggle("escondido");
  botaoMensagem.textContent = hidden ? "Abrir formulário de demonstração" : "Fechar formulário";
  botaoMensagem.setAttribute("aria-expanded", String(!hidden));
  if (!hidden) document.querySelector(".input-nome").focus();
});
formularioContato.addEventListener("submit", event => {
  event.preventDefault();
  const nome = document.querySelector(".input-nome").value.trim();
  const mensagem = document.querySelector(".input-mensagem").value.trim();
  if (!formularioContato.reportValidity()) return;
  if (!nome || mensagem.length < 10) {
    feedback.textContent = "Informe um nome e uma mensagem com pelo menos 10 caracteres.";
    return;
  }
  feedback.textContent = "Validação concluída, " + nome + ". Esta é uma demonstração: nenhuma mensagem foi enviada.";
  formularioContato.reset();
});
