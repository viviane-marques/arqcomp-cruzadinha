const GRUPOS = [
  { nome: "Processamento", itens: [
    { resp: "CPU", pista: "Cérebro do computador: busca, decodifica e executa as instruções dos programas." },
    { resp: "ULA", pista: "Parte da CPU que faz as contas e as operações lógicas." },
    { resp: "UC", pista: "Parte da CPU que comanda e coordena o que os outros componentes fazem." },
    { resp: "REGISTRADORES", pista: "Minúsculas memórias dentro da CPU, as mais rápidas, guardam dados em uso imediato." },
    { resp: "DUALCORE", pista: "Processador com dois núcleos de execução no mesmo chip." },
    { resp: "QUADCORE", pista: "Processador com quatro núcleos de execução no mesmo chip." },
    { resp: "MICROCONTROLADOR", pista: "Chip com processador, memória e portas de entrada e saída, típico de sistemas embarcados." }
  ]},
  { nome: "Memórias", itens: [
    { resp: "RAM", pista: "Memória principal e volátil que guarda programas em execução e perde tudo sem energia." },
    { resp: "ROM", pista: "Memória permanente gravada na fabricação, mantém o conteúdo mesmo sem energia." },
    { resp: "EEPROM", pista: "Memória permanente regravável por sinais elétricos, que permite alterar um único byte por vez." },
    { resp: "FLASH", pista: "Memória permanente regravável em blocos, usada em pendrives e SSDs." },
    { resp: "CACHE", pista: "Memória pequena e veloz entre CPU e RAM que guarda dados usados com frequência." },
    { resp: "MEMORIADEMASSA", pista: "Guarda arquivos e programas por muito tempo, em grande capacidade, como um HD." }
  ]},
  { nome: "Comunicação", itens: [
    { resp: "DMA", pista: "Mecanismo que move dados entre memória e periféricos sem ocupar a CPU." },
    { resp: "ADDRESSBUS", pista: "Caminho de mão única por onde a CPU informa a posição de memória desejada." },
    { resp: "DATABUS", pista: "Caminho de mão dupla por onde trafegam os valores lidos e escritos entre componentes." }
  ]}
];

const placa = document.getElementById("placa");
const contador = document.getElementById("contador");
const barra = document.getElementById("barra");
const status = document.getElementById("status");
const TOTAL = GRUPOS.reduce((s, g) => s + g.itens.length, 0);
const chips = [];

let n = 1;
GRUPOS.forEach(g => {
  const h = document.createElement("h2");
  h.className = "grupo-titulo";
  h.textContent = g.nome;
  placa.appendChild(h);

  g.itens.forEach(item => {
    const el = document.createElement("div");
    el.className = "chip";
    el.innerHTML = `<span class="led"></span><div class="num">Chip ${n++}</div><div class="pista"></div><div class="casas"></div>`;
    el.querySelector(".pista").textContent = item.pista;
    const casas = el.querySelector(".casas");
    const inputs = [];
    for (let i = 0; i < item.resp.length; i++) {
      const inp = document.createElement("input");
      inp.maxLength = 1;
      inp.autocomplete = "off";
      inp.setAttribute("aria-label", `Letra ${i + 1} do chip ${n - 1}`);
      inp.addEventListener("input", () => {
        inp.value = inp.value.toUpperCase().replace(/[^A-Z]/g, "");
        el.classList.remove("certo", "errado");
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
      });
      inp.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !inp.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ""; }
        if (e.key === "ArrowLeft" && inputs[i - 1]) inputs[i - 1].focus();
        if (e.key === "ArrowRight" && inputs[i + 1]) inputs[i + 1].focus();
        if (e.key === "Enter") conferir();
      });
      inp.addEventListener("focus", () => inp.select());
      casas.appendChild(inp);
      inputs.push(inp);
    }
    placa.appendChild(el);
    chips.push({ el, inputs, resp: item.resp });
  });
});

function atualizarPlacar(acertos) {
  contador.textContent = `${acertos} de ${TOTAL} palavras`;
  barra.style.width = (acertos / TOTAL * 100) + "%";
  if (acertos === TOTAL) status.textContent = "🎉 Sistema inicializado! Todos os chips estão ativos.";
  else if (acertos >= TOTAL * 0.75) status.textContent = "Quase lá: o sistema operacional está carregando...";
  else if (acertos >= TOTAL * 0.4) status.textContent = "BIOS carregada. Continue ligando os chips!";
  else if (acertos > 0) status.textContent = "Alguns chips acenderam. Corrija os vermelhos e tente de novo.";
  else status.textContent = "Nenhum chip ativo ainda. Revise as pistas e tente novamente.";
}

function conferir() {
  let acertos = 0;
  chips.forEach(c => {
    const digitado = c.inputs.map(i => i.value).join("");
    const ok = digitado === c.resp;
    if (ok) acertos++;
    c.el.classList.toggle("certo", ok);
    c.el.classList.toggle("errado", !ok);
  });
  atualizarPlacar(acertos);
}

function reiniciar() {
  chips.forEach(c => {
    c.inputs.forEach(i => (i.value = ""));
    c.el.classList.remove("certo", "errado");
  });
  contador.textContent = `0 de ${TOTAL} palavras`;
  barra.style.width = "0";
  status.textContent = "Sistema desligado. Aperte as teclas e comece a montar!";
  chips[0].inputs[0].focus();
}

document.getElementById("btnConferir").addEventListener("click", conferir);
document.getElementById("btnReiniciar").addEventListener("click", reiniciar);
contador.textContent = `0 de ${TOTAL} palavras`;
