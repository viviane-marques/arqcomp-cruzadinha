const R = 8, C = 8, N = R * C, NP = 12;

const BANCO = [
  { rotulo: "CPU", pista: "Cérebro do computador: busca, decodifica e executa as instruções dos programas." },
  { rotulo: "ULA", pista: "Parte da CPU que faz as contas e as operações lógicas." },
  { rotulo: "UC", pista: "Parte da CPU que comanda e coordena o que os outros componentes fazem." },
  { rotulo: "REGIS-\nTRADO-\nRES", pista: "Minúsculas memórias dentro da CPU, as mais rápidas, guardam dados em uso imediato." },
  { rotulo: "RAM", pista: "Memória principal e volátil que guarda programas em execução e perde tudo sem energia." },
  { rotulo: "ROM", pista: "Memória permanente gravada na fabricação, mantém o conteúdo mesmo sem energia." },
  { rotulo: "EEPROM", pista: "Memória permanente regravável por sinais elétricos, que permite alterar um único byte por vez." },
  { rotulo: "FLASH", pista: "Memória permanente regravável em blocos, usada em pendrives e SSDs." },
  { rotulo: "CACHE", pista: "Memória pequena e veloz entre CPU e RAM que guarda dados usados com frequência." },
  { rotulo: "MEMORIA\nDE\nMASSA", pista: "Guarda arquivos e programas por muito tempo, em grande capacidade, como um HD." },
  { rotulo: "DMA", pista: "Mecanismo que move dados entre memória e periféricos sem ocupar a CPU." },
  { rotulo: "ADDRESS\nBUS", pista: "Caminho de mão única por onde a CPU informa a posição de memória desejada." },
  { rotulo: "DATA\nBUS", pista: "Caminho de mão dupla por onde trafegam os valores lidos e escritos entre componentes." },
  { rotulo: "MICRO-\nCONTRO-\nLADOR", pista: "Chip com processador, memória e portas de entrada e saída, típico de sistemas embarcados." },
  { rotulo: "DUAL\nCORE", pista: "Processador com dois núcleos de execução no mesmo chip." },
  { rotulo: "QUAD\nCORE", pista: "Processador com quatro núcleos de execução no mesmo chip." }
];

const CORES = ["#ff4d5e", "#ff9f1a", "#f6e05e", "#2ecc71", "#1abc9c", "#3aa0ff",
               "#7c6cff", "#c05cf0", "#ff5cb8", "#c58a52", "#b8c2cc", "#7de0ff"];

const grid = document.getElementById("grid");
const svg = document.getElementById("fios");
const listaPistas = document.getElementById("pistas");
const contador = document.getElementById("contador");
const barra = document.getElementById("barra");
const preenchidasEl = document.getElementById("preenchidas");
const statusEl = document.getElementById("status");

let pares = [];      // 12 itens sorteados (índice = número da pista - 1)
let dots = [];       // dots[cel] = {t:'q'|'a', p}
let dotEls = [];
let respCell = [];   // célula da resposta certa de cada pista
let paths = [];      // paths[p] = lista de células do fio da pista p
let dono = [];       // dono[cel] = pista dona do fio naquela célula (ou -1)
let desenhando = null;
let marcas = [];     // resultado do Conferir por pista

function embaralhar(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Gera um caminho que passa por todas as casas (algoritmo "backbite") */
function gerarCaminho() {
  let path = [];
  for (let r = 0; r < R; r++)
    for (let k = 0; k < C; k++) path.push(r * C + (r % 2 === 0 ? k : C - 1 - k));

  const viz = i => {
    const r = Math.floor(i / C), c = i % C, v = [];
    if (r > 0) v.push(i - C);
    if (r < R - 1) v.push(i + C);
    if (c > 0) v.push(i - 1);
    if (c < C - 1) v.push(i + 1);
    return v;
  };

  for (let t = 0; t < 4000; t++) {
    if (Math.random() < 0.5) {
      const cand = viz(path[N - 1]).filter(x => x !== path[N - 2]);
      const nb = cand[Math.floor(Math.random() * cand.length)];
      const k = path.indexOf(nb);
      path = path.slice(0, k + 1).concat(path.slice(k + 1).reverse());
    } else {
      const cand = viz(path[0]).filter(x => x !== path[1]);
      const nb = cand[Math.floor(Math.random() * cand.length)];
      const k = path.indexOf(nb);
      path = path.slice(0, k).reverse().concat(path.slice(k));
    }
  }
  return path;
}

/* Divide o caminho em NP pedaços (cada um com pelo menos 3 casas) */
function dividir(path) {
  const lens = Array(NP).fill(3);
  for (let extra = N - 3 * NP; extra > 0; extra--) lens[Math.floor(Math.random() * NP)]++;
  let pos = 0;
  return lens.map(l => { const seg = path.slice(pos, pos + l); pos += l; return seg; });
}

function novoJogo() {
  pares = embaralhar([...BANCO]).slice(0, NP);
  const segs = dividir(gerarCaminho());

  dots = Array(N).fill(null);
  respCell = [];
  segs.forEach((seg, p) => {
    const s = Math.random() < 0.5 ? [...seg].reverse() : seg;
    dots[s[0]] = { t: "q", p };
    dots[s[s.length - 1]] = { t: "a", p };
    respCell[p] = s[s.length - 1];
  });

  // tabuleiro
  grid.innerHTML = "";
  dotEls = [];
  for (let i = 0; i < N; i++) {
    const cel = document.createElement("div");
    cel.className = "cell";
    if (dots[i]) {
      const d = document.createElement("div");
      d.className = "dot " + dots[i].t;
      if (dots[i].t === "q") {
        d.textContent = dots[i].p + 1;
        d.style.background = CORES[dots[i].p];
      } else {
        d.textContent = pares[dots[i].p].rotulo;
      }
      cel.appendChild(d);
      dotEls[i] = d;
    }
    grid.appendChild(cel);
  }

  // lista de pistas
  listaPistas.innerHTML = "";
  pares.forEach((it, p) => {
    const li = document.createElement("li");
    li.innerHTML = '<span class="badge"></span><span class="txt"></span><span class="marca"></span>';
    const b = li.querySelector(".badge");
    b.textContent = p + 1;
    b.style.background = CORES[p];
    li.querySelector(".txt").textContent = it.pista;
    listaPistas.appendChild(li);
  });

  reiniciar();
}

function reiniciar() {
  paths = Array.from({ length: NP }, () => []);
  dono = Array(N).fill(-1);
  desenhando = null;
  marcas = [];
  contador.textContent = `0 de ${NP} palavras`;
  barra.style.width = "0";
  statusEl.textContent = "Painel desligado. Comece a ligar os fios!";
  desenhar();
}

/* ---------- Desenho ---------- */
function desenhar() {
  svg.innerHTML = "";
  paths.forEach((arr, p) => {
    if (arr.length < 2) return;
    const pts = arr.map(i => `${(i % C) * 100 + 50},${Math.floor(i / C) * 100 + 50}`).join(" ");
    const pl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    pl.setAttribute("points", pts);
    pl.setAttribute("fill", "none");
    pl.setAttribute("stroke", CORES[p]);
    pl.setAttribute("stroke-width", "34");
    pl.setAttribute("stroke-linecap", "round");
    pl.setAttribute("stroke-linejoin", "round");
    pl.setAttribute("opacity", "0.92");
    svg.appendChild(pl);
  });

  dotEls.forEach((el, i) => {
    if (!el || dots[i].t !== "a") return;
    const p = dono[i];
    el.style.background = p >= 0 ? CORES[p] : "";
    el.classList.toggle("certo", p >= 0 && marcas[p] === "certo");
    el.classList.toggle("errado", p >= 0 && marcas[p] === "errado");
  });

  [...listaPistas.children].forEach((li, p) => {
    li.classList.toggle("certo", marcas[p] === "certo");
    li.classList.toggle("errado", marcas[p] === "errado" || marcas[p] === "incompleto");
    li.querySelector(".marca").textContent =
      marcas[p] === "certo" ? "✓" : marcas[p] === "errado" ? "✗" : marcas[p] === "incompleto" ? "…" : "";
  });

  const cheias = dono.filter(x => x >= 0).length;
  preenchidasEl.textContent = `Casas preenchidas: ${cheias} de ${N}`;
}

/* ---------- Lógica dos fios ---------- */
function cortar(p, k) {
  const arr = paths[p];
  for (let j = k; j < arr.length; j++) dono[arr[j]] = -1;
  arr.length = k;
}

function entrar(i) {
  const p = desenhando;
  const arr = paths[p];
  const ultimo = arr[arr.length - 1];

  // voltar uma casa
  if (arr.length >= 2 && arr[arr.length - 2] === i) {
    cortar(p, arr.length - 1);
    return true;
  }
  // cruzar o próprio fio: volta até ali
  if (dono[i] === p) {
    cortar(p, arr.indexOf(i) + 1);
    return true;
  }
  const d = dots[i];
  if (d && d.t === "q") return false; // não entra em outra pergunta

  // cortar o fio de outra cor
  if (dono[i] >= 0 && dono[i] !== p) {
    cortar(dono[i], paths[dono[i]].indexOf(i));
  }
  arr.push(i);
  dono[i] = p;
  if (d && d.t === "a") desenhando = null; // chegou numa resposta: fio ligado
  return true;
}

function idxDe(e) {
  const r = grid.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  if (x < 0 || y < 0 || x >= 1 || y >= 1) return -1;
  return Math.floor(y * R) * C + Math.floor(x * C);
}

grid.addEventListener("pointerdown", e => {
  const i = idxDe(e);
  if (i < 0) return;
  const d = dots[i];
  let p = null;

  if (d && d.t === "q") {
    p = d.p;
    cortar(p, 0);
    paths[p] = [i];
    dono[i] = p;
  } else if (dono[i] >= 0) {
    p = dono[i];
    const k = paths[p].indexOf(i);
    // pegar a ponta de um fio já ligado: solta a resposta e continua dali
    cortar(p, d && d.t === "a" ? k : k + 1);
  }
  if (p === null) return;

  marcas = [];
  statusEl.textContent = "Arraste até a resposta certa.";
  desenhando = p;
  grid.setPointerCapture(e.pointerId);
  desenhar();
});

grid.addEventListener("pointermove", e => {
  if (desenhando === null) return;
  const alvo = idxDe(e);
  if (alvo < 0) return;

  for (let guarda = 0; guarda < 16 && desenhando !== null; guarda++) {
    const arr = paths[desenhando];
    const ult = arr[arr.length - 1];
    if (ult === alvo) break;
    const dr = Math.floor(alvo / C) - Math.floor(ult / C);
    const dc = (alvo % C) - (ult % C);
    const prox = (dr !== 0 && Math.abs(dr) >= Math.abs(dc))
      ? ult + Math.sign(dr) * C
      : ult + Math.sign(dc);
    if (!entrar(prox)) break;
  }
  desenhar();
});

["pointerup", "pointercancel"].forEach(ev =>
  grid.addEventListener(ev, () => { desenhando = null; desenhar(); })
);

/* ---------- Conferir ---------- */
function conferir() {
  let ok = 0;
  marcas = paths.map((arr, p) => {
    const fim = arr[arr.length - 1];
    const ligado = arr.length > 1 && dots[fim] && dots[fim].t === "a";
    if (!ligado) return "incompleto";
    if (fim === respCell[p]) { ok++; return "certo"; }
    return "errado";
  });

  const cheias = dono.filter(x => x >= 0).length;
  contador.textContent = `${ok} de ${NP} palavras`;
  barra.style.width = (ok / NP) * 100 + "%";

  if (ok === NP && cheias === N) statusEl.textContent = "🎉 Painel 100% conectado! Todas certas e todas as casas preenchidas.";
  else if (ok === NP) statusEl.textContent = "Todas as ligações estão certas! Agora refaça os fios para preencher todas as casas.";
  else statusEl.textContent = "Os marcados com ✗ ou … estão errados ou soltos. Ajuste e confira de novo.";
  desenhar();
}

document.getElementById("btnConferir").addEventListener("click", conferir);
document.getElementById("btnReiniciar").addEventListener("click", reiniciar);
document.getElementById("btnNovo").addEventListener("click", novoJogo);

novoJogo();