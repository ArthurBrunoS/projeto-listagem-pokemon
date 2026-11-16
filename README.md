# Catálogo Pokémon — versão estática

[Demonstração online](https://arthurbrunos.github.io/projeto-listagem-pokemon/) · [Todos os projetos](https://arthurbrunos.github.io/projeto-listagem-pokemon/projetos/)

Catálogo de estudo com cards locais de Pokémon, filtro por nome e tipo e alternância de tema.

## Tecnologias

HTML5, CSS3 e JavaScript puro.

## Funcionalidades

- Busca por nome sem diferenciar acentos ou maiúsculas.
- Combinação de busca e tipo, com botão para limpar filtros.
- Tema persistido e funcionamento mesmo com armazenamento bloqueado.
- Cards com imagens locais e layout flexível.

## Executar localmente

1. Clone este repositório e abra a pasta no VS Code.
2. Abra `index.html` com a extensão Live Server, ou sirva a pasta com um servidor HTTP estático.
3. Acesse a página no navegador. O `index.html` da raiz é o ponto de entrada.

## Validação

Checklist de navegador:

- [ ] Buscar `bulba` e filtrar Grama; conferir o resultado.
- [ ] Combinar nome e tipo incompatíveis e conferir estado vazio.
- [ ] Limpar os filtros, alternar tema e recarregar.
- [ ] Navegar com Tab em tela pequena.

A verificação visual e as capturas de tela devem ser feitas após abrir a versão atual no navegador. Não há capturas publicadas nem garantia de validação visual nesta revisão.

## Demonstração e publicação

O GitHub Pages publica a branch main deste repositório. A página projetos/ reúne os seis projetos. As pastas demos/ contêm cópias estáticas dos demais aplicativos, com versões de origem registradas em projetos/versoes.json. A publicação foi confirmada pelo fluxo do Pages e por verificação HTTP de 12 páginas e 37 recursos.

## Limitações e autoria

Os dados são estáticos e cobrem somente os Pokémon cadastrados no HTML. Para integração com API, consulte o projeto [Pokedex](https://github.com/ArthurBrunoS/Pokedex).

Este README descreve a versão proposta nesta revisão. O histórico do Git preserva os autores e as contribuições anteriores. Materiais de curso, imagens e serviços de terceiros devem ter suas condições de uso verificadas antes de uma redistribuição; esta revisão não atribui autoria exclusiva nem adiciona uma licença aos recursos existentes.
