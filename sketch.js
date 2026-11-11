
/*
  PERSEGUIÇÃO DE CRISTÃOS — WWL 2026
  p5.js 2.0

  BRANCO = população cristã mundial (simbólica)
  VERMELHO = indicador selecionado

  Passar o rato no globo: rodar em 3D
  Clicar nos indicadores: alterar os pontos

  Os pontos não representam pessoas individuais.
  A distribuição é ilustrativa.
*/

// DADOS
let dados = [
  ["CRISTÃOS PERSEGUIDOS", "388 MILHÕES+", 388000000],
  ["MORTOS PELA FÉ", "4.849", 4849],
  ["MORTES POR DIA", "≈ 13", 13],
  ["SEQUESTRADOS", "3.302", 3302],
  ["DETIDOS OU CONDENADOS", "4.712", 4712],
  ["IGREJAS E PROPRIEDADES ATACADAS", "3.632", 3632],
  ["VIOLÊNCIA FÍSICA OU PSICOLÓGICA", "67.843", 67843],
  ["DESLOCADOS OU FORÇADOS A FUGIR", "224.129", 224129],
  ["VIOLÊNCIA SEXUAL E CASAMENTO FORÇADO", "5.202", 5202]
];

let totalCristaos = 2600000000;
let selecionado = 0;

// Coordenadas aproximadas: latitude e longitude
let paises = [
  ["Nigéria", 9, 8],
  ["Índia", 21, 79],
  ["China", 35, 105],
  ["Paquistão", 30, 69],
  ["Sudão", 15, 30],
  ["Coreia do Norte", 40, 127],
  ["Irão", 32, 54],
  ["Mianmar", 21, 96],
  ["Somália", 5, 46],
  ["Eritreia", 15, 39],
  ["Síria", 35, 38],
  ["Burquina Faso", 12, -2]
];

// Regiões de destaque por indicador.
// Índices correspondem à lista de países.
let regioes = [
  [0,1,2,3,4,5,6,7,8,9,10,11],
  [0,4,8,11],
  [0,4,8,11],
  [0,3,4],
  [5,2,6,9,3],
  [0,4,7,10,1],
  [0,1,3,4,7],
  [0,4,7,10],
  [0,3,1,8]
];

let pontosBrancos = [];
let pontosVermelhos = [];

let rotX = 0;
let rotY = 0;
let alvoX = 0;
let alvoY = 0;

let cx, cy, raio;
let escala, margemX, margemY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(displayDensity(), 2));
  textFont("monospace");

  // Pontos brancos distribuídos pela esfera.
  // Representam visualmente a população global,
  // sem equivaler a uma pessoa por ponto.
  randomSeed(2026);

  for (let i = 0; i < 2300; i++) {
    pontosBrancos.push({
      lat: asin(random(-1, 1)),
      lon: random(-PI, PI)
    });
  }

  criarPontosVermelhos();
}

function criarPontosVermelhos() {
  pontosVermelhos = [];
  randomSeed(2026 + selecionado);

  let quantidade = 650;
  let lista = regioes[selecionado];

  for (let i = 0; i < quantidade; i++) {
    let indice = random(lista);
    let pais = paises[indice];

    pontosVermelhos.push({
      lat: radians(pais[1] + randomGaussian() * 5),
      lon: radians(pais[2] + randomGaussian() * 7),
      fase: random(TWO_PI)
    });
  }
}

function draw() {
  background(3, 3, 5);

  escala = min(width / 1440, height / 820);
  margemX = (width - 1440 * escala) / 2;
  margemY = (height - 820 * escala) / 2;

  let mx = (mouseX - margemX) / escala;
  let my = (mouseY - margemY) / escala;

  cx = 720;
  cy = 410;
  raio = 225;

  // O rato controla dois eixos de rotação.
  if (dist(mx, my, cx, cy) < raio) {
    alvoY = map(mx, cx - raio, cx + raio, -PI, PI);
    alvoX = map(my, cy - raio, cy + raio, -PI / 3, PI / 3);
  }

  rotX = lerp(rotX, alvoX, 0.07);
  rotY = lerp(rotY, alvoY, 0.07);

  push();
  translate(margemX, margemY);
  scale(escala);

  desenharFundo();
  desenharDados();
  desenharGlobo();
  desenharDetalhes();

  pop();
}

// 1. FUNDO
function desenharFundo() {
  stroke(35);
  strokeWeight(0.5);

  for (let x = 0; x < 1440; x += 40) {
    line(x, 0, x, 820);
  }

  for (let y = 0; y < 820; y += 40) {
    line(0, y, 1440, y);
  }

  noStroke();
  fill(235);
  textSize(22);
  text("PERSEGUIÇÃO DE CRISTÃOS", 40, 49);

  fill(230, 35, 50);
  textSize(10);
  text("WORLD WATCH LIST / 2026", 40, 75);

  fill(145);
  text("01 OUT 2024 — 30 SET 2025", 1390, 49);

  stroke(90);
  line(40, 100, 1390, 100);
}

// 2. INDICADORES
function desenharDados() {
  let x = 40;
  let y = 140;

  noStroke();
  fill(230);
  textSize(11);
  text("01 / INDICADORES GLOBAIS", x, y);

  for (let i = 0; i < dados.length; i++) {
    let yy = 185 + i * 57;

    if (selecionado === i) {
      fill(230, 35, 50, 35);
      rect(x - 5, yy - 16, 285, 50);
    }

    fill(selecionado === i ? color(230, 35, 50) : 150);
    textSize(9);
    text(dados[i][0], x, yy);

    fill(235);
    textSize(19);
    text(dados[i][1], x, yy + 23);

    stroke(65);
    line(x, yy + 35, x + 280, yy + 35);
    noStroke();
  }

  // Painel direito
  let rx = 1090;

  fill(230);
  textSize(11);
  text("03 / ANÁLISE SELECIONADA", rx, 140);

  stroke(90);
  line(rx, 160, 1390, 160);
  noStroke();

  fill(230, 35, 50);
  textSize(30);
  text(dados[selecionado][1], rx, 218);

  fill(235);
  textSize(10);
  text(dados[selecionado][0], rx, 245);

  fill(150);
  text("REGIÕES REPRESENTADAS", rx, 310);

  let lista = regioes[selecionado];

  for (let i = 0; i < lista.length; i++) {
    let pais = paises[lista[i]];

    fill(230, 35, 50);
    circle(rx + 4, 339 + i * 22, 3);

    fill(190);
    textSize(10);
    text(pais[0], rx + 17, 343 + i * 22);
  }

  fill(145);
  textSize(9);
  text("LOCALIZAÇÕES ILUSTRATIVAS", rx, 665);
  text("NÃO REPRESENTAM VÍTIMAS INDIVIDUAIS", rx, 683);
}

// 3. PROJEÇÃO TRIDIMENSIONAL
function projetar(lat, lon) {
  // Coordenadas de uma esfera 3D
  let x = cos(lat) * sin(lon);
  let y = sin(lat);
  let z = cos(lat) * cos(lon);

  // Rotação horizontal
  let xx = x * cos(rotY) + z * sin(rotY);
  let zz = -x * sin(rotY) + z * cos(rotY);

  // Rotação vertical
  let yy = y * cos(rotX) - zz * sin(rotX);
  let zFinal = y * sin(rotX) + zz * cos(rotX);

  return {
    x: cx + xx * raio,
    y: cy - yy * raio,
    z: zFinal
  };
}

// 4. GLOBO INTERATIVO
function desenharGlobo() {
  noStroke();
  fill(9, 9, 12);
  circle(cx, cy, raio * 2);

  // Linhas geográficas
  stroke(75);
  strokeWeight(0.6);
  noFill();

  // Paralelos
  for (let lat = -75; lat <= 75; lat += 15) {
    let anterior = null;

    for (let lon = -180; lon <= 180; lon += 4) {
      let p = projetar(radians(lat), radians(lon));

      if (anterior && p.z > 0 && anterior.z > 0) {
        line(anterior.x, anterior.y, p.x, p.y);
      }
      anterior = p;
    }
  }

  // Meridianos
  for (let lon = -180; lon <= 180; lon += 15) {
    let anterior = null;

    for (let lat = -90; lat <= 90; lat += 4) {
      let p = projetar(radians(lat), radians(lon));

      if (anterior && p.z > 0 && anterior.z > 0) {
        line(anterior.x, anterior.y, p.x, p.y);
      }
      anterior = p;
    }
  }

  // Pontos brancos: população global simbólica
  noStroke();

  for (let ponto of pontosBrancos) {
    let p = projetar(ponto.lat, ponto.lon);

    if (p.z > 0) {
      fill(220, 220, 225, 135);
      circle(p.x, p.y, 1.2);
    }
  }

  // Pontos vermelhos: indicador selecionado
  for (let ponto of pontosVermelhos) {
    let p = projetar(ponto.lat, ponto.lon);

    if (p.z > 0) {
      let brilho = 175 +
        80 * sin(frameCount * 0.035 + ponto.fase);

      noStroke();
      fill(230, 35, 50, 30);
      circle(p.x, p.y, 7);

      fill(230, 35, 50, brilho);
      circle(p.x, p.y, 2.5);
    }
  }

  // Contornos do globo
  noFill();
  stroke(205);
  strokeWeight(1);
  circle(cx, cy, raio * 2);

  stroke(80);
  circle(cx, cy, (raio + 18) * 2);
  circle(cx, cy, (raio + 34) * 2);

  noStroke();
  fill(230);
  textSize(11);
  text("02 / DISTRIBUIÇÃO GEOGRÁFICA", 420, 140);

  fill(150);
  textSize(9);
  textAlign(CENTER);
  text("MOVE O RATO SOBRE O GLOBO", cx, 687);
  textAlign(LEFT);
}

// 5. CONTEXTO GLOBAL E LEGENDA
function desenharDetalhes() {
  let y = 735;

  stroke(90);
  line(420, y, 1030, y);

  noStroke();
  fill(230);
  textSize(10);
  text("04 / POPULAÇÃO CRISTÃ MUNDIAL", 420, y + 20);

  textSize(18);
  text("≈ 2,6 MIL MILHÕES", 420, y + 49);

  // Legenda
  fill(230);
  circle(760, y + 29, 5);

  fill(170);
  textSize(9);
  text("POPULAÇÃO GLOBAL (SIMBÓLICA)", 773, y + 33);

  fill(230, 35, 50);
  circle(760, y + 53, 5);

  fill(170);
  text("INDICADOR SELECIONADO", 773, y + 57);

  // Percentagem
  fill(230);
  textSize(11);
  text("14,9% SOB PERSEGUIÇÃO", 1090, 746);

  fill(65);
  rect(1090, 767, 290, 5);

  fill(230, 35, 50);
  rect(1090, 767, 290 * 388000000 / totalCristaos, 5);

  fill(140);
  textSize(9);
  text("FONTE: OPEN DOORS / WWL 2026", 40, 803);
}

// 6. INTERATIVIDADE
function mousePressed() {
  let mx = (mouseX - margemX) / escala;
  let my = (mouseY - margemY) / escala;

  if (mx >= 40 && mx <= 320) {
    for (let i = 0; i < dados.length; i++) {
      let yy = 185 + i * 57;

      if (my >= yy - 16 && my <= yy + 34) {
        selecionado = i;
        criarPontosVermelhos();

        // Orienta o globo para a primeira região
        let pais = paises[regioes[i][0]];
        alvoY = radians(pais[2]);
        alvoX = radians(-pais[1] * 0.4);
        return;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(min(displayDensity(), 2));
}
