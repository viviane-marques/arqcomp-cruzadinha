```
 ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗ ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║        ██║
██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║        ██║
╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗╚██████╗   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝
        ____   ___   ___ _____
       | __ ) / _ \ / _ \_   _|
       |  _ \| | | | | | || |
       | |_) | |_| | |_| || |
       |____/ \___/ \___/ |_|
```

# > connect_boot_

`// jogo de Arquitetura Computacional · HTML + CSS + JavaScript puros`

```
$ sudo ./connect_boot --start
[ OK ] carregando placa-mãe...
[ OK ] 12 pistas sorteadas entre 16 termos
[ OK ] aguardando conexões...
```

## > acessar_jogo

```
$ open https://viviane-marques.github.io/arqcomp-cruzadinha/
```

**Link do site:** https://viviane-marques.github.io/arqcomp-cruzadinha/

---

## > como_jogar

```
$ cat instrucoes.txt
```

1. Leia as pistas numeradas na lista ao lado do tabuleiro.
2. Arraste (mouse ou dedo) do círculo colorido com o número da pista até o círculo da resposta certa.
3. Fios de cores diferentes não podem se sobrepor: se um fio passar por cima de outro, ele corta o fio antigo.
4. Para refazer um fio, arraste de novo a partir do círculo numerado.
5. Clique em **CONFERIR**: pistas certas ficam com `✓` e erradas com `✗`.
6. O contador mostra quantas palavras estão certas, por exemplo `8 de 12 palavras`.
7. Para vencer, acerte todas as palavras **e** preencha todas as casas do tabuleiro.
8. **REINICIAR** solta todos os fios. **NOVO JOGO** sorteia 12 palavras e um novo tabuleiro.

---

## > banco_de_palavras

```
$ ls -l ./termos     # cada partida usa 12 dos 16 termos abaixo
```

| Nº | Resposta | Pista |
|----|----------|-------|
| 01 | `CPU` | Cérebro do computador: busca, decodifica e executa as instruções dos programas. |
| 02 | `ULA` | Parte da CPU que faz as contas e as operações lógicas. |
| 03 | `UC` | Parte da CPU que comanda e coordena o que os outros componentes fazem. |
| 04 | `REGISTRADORES` | Minúsculas memórias dentro da CPU, as mais rápidas, guardam dados em uso imediato. |
| 05 | `RAM` | Memória principal e volátil que guarda programas em execução e perde tudo sem energia. |
| 06 | `ROM` | Memória permanente gravada na fabricação, mantém o conteúdo mesmo sem energia. |
| 07 | `EEPROM` | Memória permanente regravável por sinais elétricos, que permite alterar um único byte por vez. |
| 08 | `FLASH` | Memória permanente regravável em blocos, usada em pendrives e SSDs. |
| 09 | `CACHE` | Memória pequena e veloz entre CPU e RAM que guarda dados usados com frequência. |
| 10 | `MEMORIADEMASSA` | Guarda arquivos e programas por muito tempo, em grande capacidade, como um HD. |
| 11 | `DMA` | Mecanismo que move dados entre memória e periféricos sem ocupar a CPU. |
| 12 | `ADDRESSBUS` | Caminho de mão única por onde a CPU informa a posição de memória desejada. |
| 13 | `DATABUS` | Caminho de mão dupla por onde trafegam os valores lidos e escritos entre componentes. |
| 14 | `MICROCONTROLADOR` | Chip com processador, memória e portas de entrada e saída, típico de sistemas embarcados. |
| 15 | `DUALCORE` | Processador com dois núcleos de execução no mesmo chip. |
| 16 | `QUADCORE` | Processador com quatro núcleos de execução no mesmo chip. |

---

## > stack

```
$ cat stack.txt
HTML5 ........ estrutura
CSS3 ......... visual terminal (verde + preto, Roboto Mono)
JavaScript ... lógica dos fios e do tabuleiro
GitHub Pages . publicação
```

```
[ OK ] sistema pronto.
```
