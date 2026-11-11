
/*
  WORLD WATCH LIST 2026
  Dashboard interativo — p5.js 2.0

  Rato sobre o globo: orientar a esfera
  Clique nos indicadores: mudar os pontos
  Clique em REINICIAR: voltar à visão geral

  Pontos = representação agregada, não pessoas individuais.
  Apenas as distribuições explicitamente documentadas
  são tratadas como quantitativas.
*/

const BG = [6, 10, 15];
const WHITE = [228, 236, 240];
const MUTED = [117, 139, 152];
const RED = [255, 104, 76];
const CYAN = [106, 204, 225];

const TOTAL_CHRISTIANS = 2600000000;
const PERSECUTED = 388000000;

const DATA = [
  {
    title: "CRISTÃOS SOB PERSEGUIÇÃO",
    value: "388 MILHÕES+",
    detail: "Cerca de 14,9% de 2,6 mil milhões de cristãos.",
    type: "general",
    clusters: [
      ["Nigéria", 9.1, 8.7, 1.0],
      ["Índia", 21, 79, 1.4],
      ["China", 35, 105, 1.4],
      ["Coreia do Norte", 40, 127, 0.8],
      ["Paquistão", 30, 69, 1.0],
      ["Síria", 35, 38, 0.8],
      ["Sudão", 15, 30, 0.9],
      ["Somália", 5, 46, 0.7],
      ["Mianmar", 21, 96, 0.9],
      ["Irão", 32, 54, 0.8],
      ["Eritreia", 15, 39, 0.6],
      ["Burquina Faso", 12, -2, 0.6]
    ],
    note: "Distribuição visual ilustrativa nos países destacados pela WWL."
  },
  {
    title: "CRISTÃOS MORTOS PELA FÉ",
    value: "4.849",
    detail: "3.490 na Nigéria; 4.491 na África Subsaariana.",
    type: "deaths",
    clusters: [
      ["Nigéria", 9.1, 8.7, 3490],
      ["Restante África Subsaariana", 0, 28, 1001],
      ["Restante mundo", 27, 70, 358]
    ],
    note: "Distribuição regional documentada. Pontos ilustrativos."
  },
  {
    title: "MORTES POR DIA",
    value: "≈ 13",
    detail: "Média diária de 4.849 mortes no período do relatório.",
    type: "deaths",
    clusters: [
      ["Nigéria", 9.1, 8.7, 3490],
      ["Restante África Subsaariana", 0, 28, 1001],
      ["Restante mundo", 27, 70, 358]
    ],
    note: "Média calculada, não contagem em tempo real."
  },
  {
    title: "CRISTÃOS SEQUESTRADOS",
    value: "3.302",
    detail: "2.293 casos documentados na Nigéria.",
    type: "kidnaps",
    clusters: [
      ["Nigéria", 9.1, 8.7, 2293],
      ["Outros países", 24, 65, 1009]
    ],
    note: "Restantes casos sem localização individual neste mapa."
  },
  {
    title: "DETIDOS OU CONDENADOS",
    value: "4.712",
    detail: "Detenções, prisões ou condenações relacionadas com a fé.",
    type: "illustrative",
    clusters: [
      ["Coreia do Norte", 40, 127, 1],
      ["China", 35, 105, 1],
      ["Irão", 32, 54, 1],
      ["Eritreia", 15, 39, 1],
      ["Paquistão", 30, 69, 1]
    ],
    note: "Países ilustrativos; sem repartição numérica por país."
  },
  {
    title: "IGREJAS E PROPRIEDADES ATACADAS",
    value: "3.632",
    detail: "Ataques documentados contra espaços cristãos.",
    type: "illustrative",
    clusters: [
      ["Nigéria", 9.1, 8.7, 1],
      ["Sudão", 15, 30, 1],
      ["Mianmar", 21, 96, 1],
      ["Síria", 35, 38, 1],
      ["Índia", 21, 79, 1]
    ],
    note: "Localizações indicativas, não totais por país."
  },
  {
    title: "VIOLÊNCIA FÍSICA OU PSICOLÓGICA",
    value: "67.843",
    detail: "Casos documentados no período analisado.",
    type: "illustrative",
    clusters: [
      ["Nigéria", 9.1, 8.7, 1],
      ["Índia", 21, 79, 1],
      ["Mianmar", 21, 96, 1],
      ["Paquistão", 30, 69, 1],
      ["Sudão", 15, 30, 1]
    ],
    note: "Distribuição geográfica ilustrativa."
  },
  {
    title: "DESLOCADOS OU FORÇADOS A FUGIR",
    value: "224.129",
    detail: "Cristãos obrigados a abandonar as suas casas.",
    type: "illustrative",
    clusters: [
      ["Nigéria", 9.1, 8.7, 1],
      ["Sudão", 15, 30, 1],
      ["Síria", 35, 38, 1],
      ["Mianmar", 21, 96, 1]
    ],
    note: "Países com deslocações relatadas; proporções ilustrativas."
  },
  {
    title: "VIOLÊNCIA SEXUAL E CASAMENTO FORÇADO",
    value: "5.202",
    detail: "Vítimas de abuso, assédio ou casamento forçado.",
    type: "illustrative",
    clusters: [
      ["Nigéria", 9.1, 8.7, 1],
      ["Paquistão", 30, 69, 1],
      ["Índia", 21, 79, 1],
      ["Somália", 5, 46, 1]
    ],
    note: "Localizações simbólicas, sem repartição nacional."
  }
];

// Continentes simplificados.
// Coordenadas aproximadas [latitude, longitude].
// Servem apenas como base visual da esfera.

const LAND = [
  [
    [72,-165],[68,-145],[60,-138],[55,-130],
    [49,-125],[45,-124],[38,-122],[32,-117],
    [28,-111],[23,-106],[18,-99],[16,-90],
    [20,-86],[26,-82],[30,-81],[34,-77],
    [40,-72],[45,-66],[50,-60],[55,-68],
    [60,-78],[65,-95],[70,-120],[72,-165]
  ],
  [
    [12,-78],[8,-76],[4,-78],[-2,-80],
    [-8,-78],[-15,-75],[-22,-71],[-30,-71],
    [-40,-73],[-54,-69],[-55,-65],[-48,-62],
    [-38,-58],[-30,-50],[-22,-43],[-12,-38],
    [-5,-35],[3,-50],[9,-61],[12,-78]
  ],
  [
    [36,-10],[43,-10],[50,-5],[56,8],
    [60,20],[70,30],[72,55],[66,80],
    [60,100],[55,125],[60,145],[52,160],
    [44,145],[36,140],[30,125],[22,120],
    [12,108],[5,103],[0,110],[-8,115],
    [-10,105],[3,95],[10,80],[8,75],
    [20,72],[25,60],[30,48],[36,42],
    [40,30],[36,20],[43,12],[36,-10]
  ],
  [
    [37,-10],[35,10],[32,20],[30,32],
    [23,38],[12,50],[5,42],[-5,40],
    [-12,42],[-20,35],[-28,33],[-35,25],
    [-34,18],[-25,14],[-15,12],[-5,9],
    [5,2],[12,-16],[20,-17],[28,-13],
    [37,-10]
  ],
  [
    [-11,113],[-16,122],[-20,130],[-13,137],
    [-12,143],[-20,149],[-29,153],[-38,146],
    [-39,136],[-34,115],[-25,113],[-11,113]
  ],
  [
    [60,-52],[67,-52],[76,-42],[83,-35],
    [80,-20],[70,-22],[60,-43],[60,-52]
  ],
  [
    [32,130],[36,135],[42,141],[45,145],
    [40,144],[34,138],[32,130]
  ],
  [
    [-12,44],[-16,50],[-25,47],[-26,44],
    [-18,43],[-12,44]
  ]
];

let selected = 0;
let points = [];
let globeYaw = 18;
let globePitch = -8;
let targetYaw = 18;
let targetPitch = -8;
let globeRadius = 228;
let globeX = 735;
let globeY = 407;
let glowPhase = 0;
let hoveredIndex = -1;

const W = 1440;
const H = 820;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("Arial");
  buildPoints();
}

function buildPoints() {
  randomSeed(2026);
  points = [];

  let d = DATA[selected];
  let total = d.clusters.reduce((a, c) => a + c[3], 0);

  for (let i = 0; i < d.clusters.length; i++) {
    let c = d.clusters[i];

    let n;

    if (d.type === "deaths" || d.type === "kidnaps") {
      n = round(map(c[3] / total, 0, 1, 8, 720));
    } else if (d.type === "general") {
      n = round(c[3] * 65);
    } else {
      n = 95;
    }

    n = constrain(n, 15, 750);

    for (let j = 0; j < n; j++) {
      let spread = d.type === "general" ? 8 : 5.5;

      if (d.type === "deaths" && i === 1) spread = 14;
      if (d.type === "deaths" && i === 2) spread = 24;
      if (d.type === "kidnaps" && i === 1) spread = 25;

      let lat = constrain(
        c[1] + randomGaussian() * spread * 0.55,
        -80, 80
      );

      let lon = c[2] + randomGaussian() * spread;

      points.push({
        lat,
        lon,
        cluster: i,
        size: random(1.1, 2.8),
        phase: random(TWO_PI),
        speed: random(0.7, 1.5)
      });
    }
  }
}

function draw() {
  background(...BG);

  let s = min(width / W, height / H);
  let ox = (width - W * s) / 2;
  let oy = (height - H * s) / 2;

  let mx = (mouseX - ox) / s;
  let my = (mouseY - oy) / s;

  updateGlobe(mx, my);

  push();
  translate(ox, oy);
  scale(s);

  drawBackground();
  drawHeader();
  drawLeftPanel(mx, my);
  drawGlobe();
  drawRightPanel(mx, my);
  drawBottomPanel();
  drawFooter(mx, my);

  pop();

  glowPhase += 0.025;
}

function updateGlobe(mx, my) {
  let dx = mx - globeX;
  let dy = my - globeY;
  let inside = dx * dx + dy * dy < globeRadius * globeRadius;

  if (inside) {
    targetYaw = 18 + constrain(dx / globeRadius, -1, 1) * 65;
    targetPitch = -8 + constrain(dy / globeRadius, -1, 1) * 35;
  }

  globeYaw = lerp(globeYaw, targetYaw, 0.055);
  globePitch = lerp(globePitch, targetPitch, 0.055);
}

function drawBackground() {
  stroke(25, 39, 49, 75);
  strokeWeight(0.5);

  for (let x = 0; x < W; x += 40) {
    line(x, 0, x, H);
  }

  for (let y = 0; y < H; y += 40) {
    line(0, y, W, y);
  }

  noStroke();

  for (let i = 0; i < 80; i++) {
    let x = (i * 173.7) % W;
    let y = (i * 91.3) % H;
    fill(150, 185, 200, 25 + 15 * sin(glowPhase + i));
    circle(x, y, 1.2);
  }
}

function txt(t, x, y, size = 10, col = WHITE, align = LEFT) {
  noStroke();
  fill(...col);
  textAlign(align, TOP);
  textSize(size);
  textStyle(NORMAL);
  text(t, x, y);
}

function rule(x, y, w) {
  stroke(67, 91, 105, 120);
  strokeWeight(0.7);
  line(x, y, x + w, y);
}

function drawHeader() {
  txt("WORLD WATCH LIST / 2026", 48, 28, 10, CYAN);

  txt("PERSEGUIÇÃO DE CRISTÃOS",
      48, 49, 23, WHITE);

  txt("OBSERVATÓRIO GLOBAL  /  VISUALIZAÇÃO INTERATIVA",
      49, 84, 9, MUTED);

  txt("DADOS PUBLICADOS EM 2026",
      1390, 35, 10, WHITE, RIGHT);

  txt("01.10.2024 — 30.09.2025",
      1390, 56, 9, MUTED, RIGHT);

  rule(48, 112, 1344);
}

function drawLeftPanel(mx, my) {
  let x = 48;
  let y = 148;
  let w = 290;

  txt("01 / INDICADORES", x, y, 11, CYAN);
  rule(x, y + 26, w);

  hoveredIndex = -1;

  for (let i = 0; i < DATA.length; i++) {
    let yy = 195 + i * 54;
    let active = selected === i;

    let hover =
      mx >= x && mx <= x + w &&
      my >= yy - 5 && my <= yy + 46;

    if (hover) hoveredIndex = i;

    if (active || hover) {
      noStroke();
      fill(active ? color(255, 104, 76, 18)
                  : color(130, 180, 200, 12));
      rect(x - 8, yy - 5, w + 8, 50, 3);
    }

    if (active) {
      fill(...RED);
      rect(x - 8, yy - 5, 2, 50);
    }

    txt(
      String(i + 1).padStart(2, "0"),
      x, yy + 2, 9,
      active ? RED : MUTED
    );

    txt(
      DATA[i].title,
      x + 29, yy, 9,
      active ? WHITE : MUTED
    );

    txt(
      DATA[i].value,
      x + 29, yy + 16, 17,
      active ? RED : WHITE
    );

    rule(x, yy + 46, w);
  }

  txt("CLICA NUM INDICADOR PARA EXPLORAR",
      x, 706, 9, MUTED);
}

function project(lat, lon, radius = globeRadius) {
  let a = radians(lat);
  let b = radians(lon - globeYaw);
  let p = radians(globePitch);

  let x = cos(a) * sin(b);
  let y = sin(a);
  let z = cos(a) * cos(b);

  let yy = y * cos(p) - z * sin(p);
  let zz = y * sin(p) + z * cos(p);

  return {
    x: globeX + x * radius,
    y: globeY - yy * radius,
    z: zz,
    visible: zz >= -0.015
  };
}

function drawGlobe() {
  let r = globeRadius;

  // Halo exterior
  noFill();
  for (let i = 0; i < 8; i++) {
    stroke(63, 131, 155, 12 - i);
    strokeWeight(1);
    circle(globeX, globeY, (r + 5 + i * 4) * 2);
  }

  noStroke();
  fill(8, 19, 27);
  circle(globeX, globeY, r * 2);

  // Paralelos
  stroke(56, 98, 115, 55);
  strokeWeight(0.6);
  noFill();

  for (let lat = -75; lat <= 75; lat += 15) {
    let previous = null;

    for (let lon = -180; lon <= 180; lon += 3) {
      let p = project(lat, lon);

      if (previous && p.visible && previous.visible) {
        line(previous.x, previous.y, p.x, p.y);
      }

      previous = p;
    }
  }

  // Meridianos
  for (let lon = -180; lon <= 180; lon += 15) {
    let previous = null;

    for (let lat = -90; lat <= 90; lat += 3) {
      let p = project(lat, lon);

      if (previous && p.visible && previous.visible) {
        line(previous.x, previous.y, p.x, p.y);
      }

      previous = p;
    }
  }

  // Continentes
  for (let poly of LAND) {
    drawLand(poly);
  }

  // Pontos luminosos
  drawGeoPoints();

  // Contorno da esfera
  noFill();
  stroke(105, 164, 186, 130);
  strokeWeight(1);
  circle(globeX, globeY, r * 2);

  // Anéis de interface
  stroke(71, 103, 120, 70);
  circle(globeX, globeY, (r + 21) * 2);
  circle(globeX, globeY, (r + 36) * 2);

  drawOrbitMarkers();

  txt("02 / DISTRIBUIÇÃO GEOGRÁFICA",
      432, 148, 11, CYAN);

  txt("MOVE O RATO SOBRE A ESFERA",
      735, 671, 9, MUTED, CENTER);

  txt("PONTOS AGREGADOS / LOCALIZAÇÃO APROXIMADA",
      735, 688, 8, MUTED, CENTER);
}

function drawLand(poly) {
  // Pequenos segmentos evitam linhas atravessando o globo.
  stroke(104, 147, 157, 145);
  strokeWeight(0.9);
  noFill();

  for (let i = 0; i < poly.length - 1; i++) {
    let a = poly[i];
    let b = poly[i + 1];

    let steps = 8;
    let previous = null;

    for (let j = 0; j <= steps; j++) {
      let t = j / steps;
      let lat = lerp(a[0], b[0], t);
      let lon = lerp(a[1], b[1], t);

      let p = project(lat, lon);

      if (previous && p.visible && previous.visible) {
        line(previous.x, previous.y, p.x, p.y);
      }

      previous = p;
    }
  }
}

function drawGeoPoints() {
  let pulse = (sin(glowPhase * 1.5) + 1) / 2;

  // Desenhar pontos sem assumir que cada ponto é uma vítima.
  for (let pt of points) {
    let p = project(pt.lat, pt.lon, globeRadius + 1.5);

    if (!p.visible) continue;

    let flicker = 0.65 +
      0.35 * sin(glowPhase * pt.speed + pt.phase);

    let alpha = 95 + 140 * flicker;
    let size = pt.size * (0.85 + pulse * 0.3);

    let isMain = pt.cluster === 0;

    let c = isMain ? RED : CYAN;

    noStroke();
    fill(c[0], c[1], c[2], alpha * 0.12);
    circle(p.x, p.y, size * 6);

    fill(c[0], c[1], c[2], alpha * 0.4);
    circle(p.x, p.y, size * 2.8);

    fill(c[0], c[1], c[2], alpha);
    circle(p.x, p.y, size);
  }

  // Marcadores centrais dos agrupamentos
  for (let i = 0; i < DATA[selected].clusters.length; i++) {
    let c = DATA[selected].clusters[i];
    let p = project(c[1], c[2], globeRadius + 3);

    if (!p.visible) continue;

    let rr = 12 + 5 * sin(glowPhase * 1.2 + i);

    noFill();
    stroke(i === 0 ? color(...RED, 150)
                   : color(...CYAN, 105));
    strokeWeight(0.8);
    circle(p.x, p.y, rr * 2);

    noStroke();
    fill(i === 0 ? color(...RED) : color(...CYAN));
    circle(p.x, p.y, 3.5);
  }
}

function drawOrbitMarkers() {
  for (let i = 0; i < 24; i++) {
    let a = TWO_PI * i / 24;
    let rr = globeRadius + 36;

    let x = globeX + cos(a) * rr;
    let y = globeY + sin(a) * rr;

    noStroke();
    fill(i % 3 === 0 ? color(...CYAN, 160)
                     : color(...MUTED, 65));
    circle(x, y, i % 3 === 0 ? 2.5 : 1.2);
  }
}

function drawRightPanel(mx, my) {
  let x = 1092;
  let w = 298;
  let d = DATA[selected];

  txt("03 / ANÁLISE SELECIONADA",
      x, 148, 11, CYAN);
  rule(x, 174, w);

  txt("INDICADOR " + String(selected + 1).padStart(2, "0"),
      x, 196, 9, MUTED);

  // Valor principal
  let valueSize = d.value.length > 10 ? 25 : 34;

  txt(d.value, x, 222, valueSize, RED);

  txtWrap(d.title, x, 270, w, 12, WHITE, 18);
  txtWrap(d.detail, x, 320, w, 11, MUTED, 17);

  rule(x, 389, w);

  txt("CONCENTRAÇÕES REPRESENTADAS",
      x, 405, 9, CYAN);

  let clusters = d.clusters;
  let visible = min(clusters.length, 6);

  for (let i = 0; i < visible; i++) {
    let c = clusters[i];
    let yy = 438 + i * 34;

    noStroke();
    fill(i === 0 ? color(...RED) : color(...CYAN));
    circle(x + 4, yy + 5, 4);

    txt(c[0], x + 16, yy, 10, WHITE);

    if (d.type === "deaths" || d.type === "kidnaps") {
      txt(formatNumber(c[3]), x + w, yy,
          10, MUTED, RIGHT);
    }
  }

  rule(x, 657, w);

  txt("NOTA METODOLÓGICA", x, 672, 9, CYAN);
  txtWrap(d.note, x, 693, w, 10, MUTED, 15);
}

function txtWrap(t, x, y, w, size, col, leadingValue) {
  fill(...col);
  noStroke();
  textSize(size);
  textAlign(LEFT, TOP);
  textLeading(leadingValue);
  text(t, x, y, w);
}

function formatNumber(n) {
  return n.toLocaleString("pt-PT");
}

function drawBottomPanel() {
  let x = 432;
  let y = 731;
  let w = 590;

  rule(x, y, w);

  txt("04 / CONTEXTO GLOBAL", x, y + 13, 9, CYAN);

  txt("≈ 2,6 MIL MILHÕES",
      x, y + 32, 18, WHITE);

  txt("CRISTÃOS NO MUNDO / ESTIMATIVA 2026",
      x, y + 57, 9, MUTED);

  let bx = 725;
  let by = 758;
  let bw = 290;

  noStroke();
  fill(35, 51, 61);
  rect(bx, by, bw, 6, 2);

  fill(...RED);
  rect(bx, by, bw * PERSECUTED / TOTAL_CHRISTIANS, 6, 2);

  txt("14,9% SOB PERSEGUIÇÃO",
      bx, by - 19, 9, WHITE);

  txt("ESTIMATIVA DE PROPORÇÃO",
      bx, by + 12, 8, MUTED);
}

function drawFooter(mx, my) {
  rule(48, 799, 1344);

  txt("FONTE: OPEN DOORS / WWL 2026",
      48, 805, 8, MUTED);

  let hover =
    mx >= 1265 && mx <= 1392 &&
    my >= 795 && my <= 820;

  txt("↺  REINICIAR",
      1390, 805, 9,
      hover ? RED : CYAN,
      RIGHT);
}

function mousePressed() {
  let s = min(width / W, height / H);
  let ox = (width - W * s) / 2;
  let oy = (height - H * s) / 2;

  let mx = (mouseX - ox) / s;
  let my = (mouseY - oy) / s;

  if (mx >= 48 && mx <= 338) {
    for (let i = 0; i < DATA.length; i++) {
      let yy = 195 + i * 54;

      if (my >= yy - 5 && my <= yy + 46) {
        selected = i;
        buildPoints();

        // Orientar a esfera para a região principal.
        let c = DATA[selected].clusters[0];
        targetYaw = c[2];
        targetPitch = -c[1] * 0.25;

        return;
      }
    }
  }

  if (mx >= 1265 && mx <= 1392 &&
      my >= 795 && my <= 820) {
    selected = 0;
    targetYaw = 18;
    targetPitch = -8;
    buildPoints();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
