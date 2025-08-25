## Jogo da Velha (Electron)

Uma versão local do clássico Jogo da Velha com interface "cartoon/doodle" desenvolvida em Electron (HTML/CSS/JS).

Principais recursos
- Três níveis de dificuldade: Fácil (aleatório), Médio (heurística) e Difícil (Minimax — jogo perfeito).
- Seleção de marca (X/O) e opção de quem começa.
- Interface leve, animações e efeito sonoro ao marcar a jogada.

Pré-requisitos
- Node.js (14+ recomendado) e npm instalados no sistema.

Instalação e execução
1. No terminal, abra a pasta do projeto:

```powershell
cd "C:\Faculdade\Jogo da Velha"
```

2. Instale dependências e execute:

```powershell
npm install
npm start
```

Como jogar
- Clique em uma célula do tabuleiro para marcar quando for sua vez.
- Use o seletor de dificuldade no topo para escolher o nível da IA.
- Escolha se você joga com X ou O e quem começa.
- Botão "Reiniciar" no rodapé reinicia a partida respeitando as opções selecionadas.

Estrutura do projeto (principais arquivos)
- `index.html` — interface e layout.
- `style.css` — estilos e animações.
- `renderer.js` — lógica do jogo, IA e interações do usuário.
- `main.js` / `preload.js` — processo principal do Electron.

Empacotar para distribuição
- Recomendo usar Electron Forge ou Electron Packager para criar executáveis. Exemplo rápido com Electron Packager (instale globalmente ou como devDependency):

```powershell
npm i -D electron-packager
npx electron-packager . "JogoDaVelha" --platform=win32 --arch=x64 --out=dist --overwrite
```

Enviar para GitHub
- Inicialize um repositório local, commite e envie para um remoto (substitua a URL pelo seu repositório):


Bom jogo!
