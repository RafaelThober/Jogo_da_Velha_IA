let MARCA_JOGADOR = 'X';
let MARCA_IA = 'O';
let tabuleiro = Array(9).fill(null);
let vezHumana = true;

const celulas = document.querySelectorAll('.cell');
const elementoStatus = document.getElementById('status');
const selecaoDificuldade = document.getElementById('difficulty');
const botaoReiniciar = document.getElementById('restart');
const escolhaMarca = document.getElementById('markChoice');
const selecaoIniciador = document.getElementById('starter');

function renderizarTabuleiro() {
  celulas.forEach(cell => {
    const i = Number(cell.dataset.index);
    cell.innerHTML = '';
    cell.classList.remove('winner');
    cell.classList.remove('filled');
    const marca = tabuleiro[i];
    if (marca === 'X') {
      cell.appendChild(criarX());
      cell.classList.add('filled');
    } else if (marca === 'O') {
      cell.appendChild(criarO());
      cell.classList.add('filled');
    }
  });
}

//Verifica Empate/Vencedor
function verificarResultado(tTabuleiro) {
  const padroesVitoria = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a, b1, c] of padroesVitoria) {
    if (tTabuleiro[a] && tTabuleiro[a] === tTabuleiro[b1] && tTabuleiro[a] === tTabuleiro[c]) {
      return { winner: tTabuleiro[a], line: [a, b1, c] };
    }
  }
  if (tTabuleiro.every(c => c)) return { winner: 'tie' };
  return null;
}

function tratarJogadaHumana(index) {
  if (!vezHumana || tabuleiro[index]) return;
  tabuleiro[index] = MARCA_JOGADOR;
  tocarPop();
  vezHumana = false;
  aposJogada();
}

function aposJogada() {
  renderizarTabuleiro();
  const resultado = verificarResultado(tabuleiro);
  if (resultado) return terminarJogo(resultado);
  elementoStatus.textContent = 'IA pensando...';
  setTimeout(() => {
    jogarIA();
    renderizarTabuleiro();
    const resultadoIA = verificarResultado(tabuleiro);
    if (resultadoIA) return terminarJogo(resultadoIA);
    vezHumana = true;
    elementoStatus.textContent = `Sua vez (${MARCA_JOGADOR})`;
  }, 300);
}

function terminarJogo(resultado) {
  if (resultado.winner === 'tie') {
    elementoStatus.textContent = 'Empate!';
  } else {
    elementoStatus.textContent = resultado.winner === MARCA_JOGADOR ? 'Você venceu!' : 'IA venceu!';
    if (resultado.line) {
      resultado.line.forEach(i => {
        celulas[i].classList.add('winner');
      });
    }
  }
  vezHumana = false;
}

function jogarIA() {
  const dificuldade = selecaoDificuldade.value;
  let jogada;
  if (dificuldade === 'easy') jogada = movimentoAleatorio(tabuleiro);
  else if (dificuldade === 'medium') jogada = movimentoMedio(tabuleiro);
  else jogada = melhorMovimento(tabuleiro);
  if (jogada != null) tabuleiro[jogada] = MARCA_IA;
  if (jogada != null) tocarPop();
}

function movimentosDisponiveis(tTabuleiro) {
  return tTabuleiro.map((v, i) => v ? null : i).filter(i => i !== null);
}

//Dificuldade Fácil
function movimentoAleatorio(tTabuleiro) {
  const movimentos = movimentosDisponiveis(tTabuleiro);
  if (!movimentos.length) return null;
  return movimentos[Math.floor(Math.random() * movimentos.length)];
}

//Dificuldade Média
function movimentoMedio(tTabuleiro) {
  for (const i of movimentosDisponiveis(tTabuleiro)) {
    const copia = tTabuleiro.slice(); copia[i] = MARCA_IA;
    if (verificarResultado(copia)?.winner === MARCA_IA) return i;
  }
  for (const i of movimentosDisponiveis(tTabuleiro)) {
    const copia = tTabuleiro.slice(); copia[i] = MARCA_JOGADOR;
    if (verificarResultado(copia)?.winner === MARCA_JOGADOR) return i;
  }
  if (!tTabuleiro[4]) return 4;
  const cantos = [0,2,6,8].filter(i => !tTabuleiro[i]);
  if (cantos.length) return cantos[Math.floor(Math.random() * cantos.length)];
  return movimentoAleatorio(tTabuleiro);
}

//Dificuldade Difícil
function melhorMovimento(tTabuleiro) {
  const resultado = minimax(tTabuleiro, MARCA_IA);
  return resultado.index;
}

function minimax(estadoTabuleiro, jogador) {
  const disponiveis = movimentosDisponiveis(estadoTabuleiro);
  const resultado = verificarResultado(estadoTabuleiro);
  if (resultado) {
    if (resultado.winner === MARCA_JOGADOR) return { score: -10 };
    if (resultado.winner === MARCA_IA) return { score: 10 };
    return { score: 0 };
  }
  const movimentos = [];
  for (const i of disponiveis) {
    const mov = { index: i };
    estadoTabuleiro[i] = jogador;
    if (jogador === MARCA_IA) {
      mov.score = minimax(estadoTabuleiro, MARCA_JOGADOR).score;
    } else {
      mov.score = minimax(estadoTabuleiro, MARCA_IA).score;
    }
    estadoTabuleiro[i] = null;
    movimentos.push(mov);
  }
  let melhorIdx = 0;
  if (jogador === MARCA_IA) {
    let melhorPontuacao = -Infinity;
    for (let i = 0; i < movimentos.length; i++) {
      if (movimentos[i].score > melhorPontuacao) {
        melhorPontuacao = movimentos[i].score;
        melhorIdx = i;
      }
    }
  } else {
    let melhorPontuacao = Infinity;
    for (let i = 0; i < movimentos.length; i++) {
      if (movimentos[i].score < melhorPontuacao) {
        melhorPontuacao = movimentos[i].score;
        melhorIdx = i;
      }
    }
  }
  return movimentos[melhorIdx];
}

// --- Helpers para criar ícones SVG (X e O) ---
function criarX() {
  const wrapper = document.createElement('span');
  wrapper.className = 'mark mark-x';
  wrapper.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="16" y1="18" x2="80" y2="82" />
      <line x1="20" y1="20" x2="84" y2="86" stroke-opacity="0.9" />
      <line x1="82" y1="18" x2="18" y2="82" />
      <line x1="78" y1="22" x2="14" y2="86" stroke-opacity="0.9" />
    </svg>`;
  return wrapper;
}

function criarO() {
  const wrapper = document.createElement('span');
  wrapper.className = 'mark mark-o';
  wrapper.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="50" cy="50" r="33" stroke-opacity="0.95" />
      <circle cx="50" cy="50" r="28" fill="rgba(255,106,61,0.06)" stroke-opacity="0.9" />
    </svg>`;
  return wrapper;
}

const somPop = (function criarPop() {
  try {
    const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");
    audio.volume = 0.6;
    return audio;
  } catch (e) {
    return null;
  }
})();

function tocarPop() {
  if (!somPop) return;
  try { somPop.currentTime = 0; somPop.play(); } catch (e) { /* ignore play errors */ }
}

celulas.forEach(cell => {
  cell.addEventListener('click', e => {
    const idx = Number(e.currentTarget.dataset.index);
    tratarJogadaHumana(idx);
  });
});

botaoReiniciar.addEventListener('click', () => {
  const activeBtn = escolhaMarca.querySelector('.seg.active');
  MARCA_JOGADOR = activeBtn ? activeBtn.dataset.mark : 'X';
  MARCA_IA = MARCA_JOGADOR === 'X' ? 'O' : 'X';

  tabuleiro = Array(9).fill(null);
  const iniciador = selecaoIniciador.value;
  vezHumana = iniciador === 'human';
  renderizarTabuleiro();
  if (!vezHumana) {
    elementoStatus.textContent = `IA joga primeiro (${MARCA_IA})`;
    setTimeout(() => {
      jogarIA();
      renderizarTabuleiro();
      const res = verificarResultado(tabuleiro);
      if (res) return terminarJogo(res);
      vezHumana = true;
      elementoStatus.textContent = `Sua vez (${MARCA_JOGADOR})`;
    }, 250);
  } else {
    elementoStatus.textContent = `Sua vez (${MARCA_JOGADOR})`;
  }
});

if (escolhaMarca) {
  escolhaMarca.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mark]');
    if (!btn) return;
    escolhaMarca.querySelectorAll('button[data-mark]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
}

renderizarTabuleiro();

setTimeout(() => { botaoReiniciar.click(); }, 50);
