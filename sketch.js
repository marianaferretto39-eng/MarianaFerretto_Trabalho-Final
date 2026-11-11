
// const cria constantes, valores que não podem ser substituídos.
// W/H = dimensões; C/G/R = branco, cinzento e vermelho em RGB.
const W=1440,H=820,C=[235,235,238],G=[145,145,150],R=[229,35,50];

// Arrays são listas: cada nome corresponde ao número na mesma posição.
const nomes=["CRISTÃOS PERSEGUIDOS","MORTOS PELA FÉ","MORTES POR DIA","SEQUESTRADOS","DETIDOS OU CONDENADOS","IGREJAS E PROPRIEDADES ATACADAS","VIOLÊNCIA FÍSICA OU PSICOLÓGICA","DESLOCADOS OU FORÇADOS A FUGIR","VIOLÊNCIA SEXUAL E CASAMENTO FORÇADO"];
const numeros=[388000000,4849,13,3302,4712,3632,67843,224129,5202];

// Formata números: Math.round arredonda; pt-PT adiciona separadores portugueses.
const fmt=n=>Math.round(n).toLocaleString("pt-PT");
// map percorre os nomes e junta nome, valor formatado e valor numérico.
let dados=nomes.map((n,i)=>[n,fmt(numeros[i]),numeros[i]]);
dados[0][1]="388 MILHÕES+";dados[2][1]="≈ 13";

// let cria variáveis que podem mudar durante a execução.
// sel = indicador selecionado; escV = valor de cada ponto vermelho.
// rx/ry = rotação atual; ax/ay = rotação pretendida.
// s = escala do ecrã; ox/oy = margens de centralização.
let total=2600000000,ano=2026,atualizado="2026-01",estado="DADOS INICIAIS";
let sel=0,escV=1000000,brancos=[],vermelhos=[],rx=0,ry=0,ax=0,ay=0,s=1,ox=0,oy=0;
// Centro e raio do globo.
const cx=720,cy=410,r=225;

// Cada país tem [nome, latitude, longitude, peso ilustrativo].
// O peso influencia quantos pontos brancos aparecem perto desse país.
const paises=[
["Nigéria",9,8,6],["Índia",21,79,12],["China",35,105,5],["Paquistão",30,69,4],
["Sudão",15,30,2],["Coreia do Norte",40,127,1],["Irão",32,54,2],["Mianmar",21,96,2],
["Somália",5,46,1],["Eritreia",15,39,1],["Síria",35,38,1],["Burquina Faso",12,-2,1],
["Brasil",-14,-51,11],["Estados Unidos",39,-98,9],["México",23,-102,5],["Rússia",56,60,4],
["Filipinas",13,122,4],["Etiópia",9,40,3],["África do Sul",-29,24,3],["Alemanha",51,10,4],
["Indonésia",-3,118,6],["Quénia",0,38,3],["Uganda",1,32,2],["Egito",27,30,4]
];
// Cada lista indica os índices dos países associados a um indicador.
// São localizações ilustrativas, não estatísticas oficiais por país.
const regioes=[[0,1,2,3,4,5,6,7,8,9,10,11],[0,4,8,11],[0,4,8,11],[0,3,4],[5,2,6,9,3],[0,4,7,10,1],[0,1,3,4,7],[0,4,7,10],[0,3,1,8]];

// Coordenadas [latitude, longitude] que desenham contornos simplificados.
const continentes=[
[[72,-165],[68,-145],[60,-138],[49,-125],[38,-122],[28,-111],[18,-99],[16,-90],[20,-86],[30,-81],[40,-72],[50,-60],[60,-78],[70,-120],[72,-165]],
[[12,-78],[4,-78],[-8,-78],[-22,-71],[-40,-73],[-55,-65],[-38,-58],[-22,-43],[-5,-35],[9,-61],[12,-78]],
[[36,-10],[50,-5],[60,20],[72,55],[66,80],[60,100],[55,125],[60,145],[44,145],[30,125],[12,108],[0,110],[-10,105],[10,80],[20,72],[30,48],[40,30],[43,12],[36,-10]],
[[37,-10],[35,10],[30,32],[12,50],[-5,40],[-20,35],[-35,25],[-34,18],[-15,12],[5,2],[20,-17],[37,-10]],
[[-11,113],[-16,122],[-13,137],[-20,149],[-38,146],[-34,115],[-11,113]],
[[60,-52],[76,-42],[83,-35],[80,-20],[70,-22],[60,-43],[60,-52]],
[[32,130],[36,135],[42,141],[45,145],[40,144],[34,138],[32,130]]
];

// Função auxiliar para escrever texto sem repetir cor, tamanho e posição.
function texto(t,x,y,z=10,c=G){
  noStroke();fill(...c);textSize(z);text(t,x,y);
}

// Cria um ponto perto de um país.
// randomGaussian distribui pontos próximos do centro; radians converte graus.
// fase permite que os pontos vermelhos pisquem em momentos diferentes.
function ponto(p,a,b){
  return {lat:radians(constrain(p[1]+randomGaussian()*a,-85,85)),
          lon:radians(p[2]+randomGaussian()*b),fase:random(TWO_PI)};
}

// setup executa apenas uma vez quando o programa começa.
// Cria o canvas, escolhe a fonte e inicia os pontos e os dados.
function setup(){
  createCanvas(windowWidth,windowHeight);
  pixelDensity(min(displayDensity(),2));textFont("monospace");
  criarBrancos();criarVermelhos();atualizarDados();
  // setInterval verifica o JSON a cada 3.600.000 ms = 1 hora.
  setInterval(atualizarDados,3600000);
}

// async/await permite esperar pela leitura do ficheiro dados.json.
// try tenta carregar; catch trata erros sem interromper o dashboard.
async function atualizarDados(){
  try{
    let res=await fetch("dados.json?t="+Date.now(),{cache:"no-store"});
    if(!res.ok)throw Error("JSON indisponível");
    let b=await res.json();
    // Confirma que existem 9 indicadores com números válidos.
    if(!Array.isArray(b.indicadores)||b.indicadores.length!==9||
       !b.indicadores.every(d=>Array.isArray(d)&&d.length===3&&
       typeof d[0]==="string"&&typeof d[1]==="string"&&
       Number.isFinite(d[2])&&d[2]>=0))throw Error("Dados inválidos");
    dados=b.indicadores;ano=b.ano||ano;atualizado=b.atualizadoEm||atualizado;
    if(Number.isFinite(b.totalCristaos)&&b.totalCristaos>0&&b.totalCristaos!==total){
      total=b.totalCristaos;criarBrancos();
    }
    criarVermelhos();estado="DADOS CARREGADOS";
  }catch(e){estado="DADOS LOCAIS / SEM LIGAÇÃO";console.log(e.message);}
}

// Cria pontos brancos: 1 ponto representa 1 milhão de cristãos.
// for repete a criação; randomSeed mantém a distribuição consistente.
function criarBrancos(){
  randomSeed(2026);brancos=[];
  let soma=paises.reduce((a,p)=>a+p[3],0);
  for(let i=0;i<round(total/1000000);i++){
    let n=random(soma),pais=paises[0];
    for(let p of paises){n-=p[3];if(n<=0){pais=p;break;}}
    brancos.push(ponto(pais,7,10));
  }
}

// Cria os pontos vermelhos de acordo com o indicador selecionado.
// O operador ? : é uma forma compacta de escrever if/else.
// A escala muda para evitar milhares ou milhões de pontos no ecrã.
function criarVermelhos(){
  randomSeed(3000+sel);vermelhos=[];
  let v=dados[sel][2];
  escV=sel===0?1000000:sel===2?1:v>=100000?1000:100;
  for(let i=0;i<ceil(v/escV);i++)
    vermelhos.push(ponto(paises[random(regioes[sel])],4,6));
}

// Converte latitude e longitude em coordenadas 3D (x,y,z).
// sin/cos calculam a posição na esfera; rx/ry aplicam a rotação.
// z indica se o ponto está à frente (positivo) ou atrás do globo.
function projetar(lat,lon){
  let x=cos(lat)*sin(lon),y=sin(lat),z=cos(lat)*cos(lon);
  let xx=x*cos(ry)+z*sin(ry),zz=-x*sin(ry)+z*cos(ry);
  return {x:cx+xx*r,y:cy-(y*cos(rx)-zz*sin(rx))*r,z:y*sin(rx)+zz*cos(rx)};
}

// Liga coordenadas para desenhar paralelos, meridianos e continentes.
// O if impede desenhar linhas que estejam atrás da esfera.
function linha(coords,cor=65,peso=0.6){
  stroke(cor);strokeWeight(peso);noFill();let ant=null;
  for(let [lat,lon] of coords){
    let p=projetar(radians(lat),radians(lon));
    if(ant&&ant.z>0&&p.z>0)line(ant.x,ant.y,p.x,p.y);
    ant=p;
  }
}

// Desenha o globo completo: esfera, grelha, continentes e pontos.
function globo(){
  noStroke();fill(9,9,12);circle(cx,cy,r*2);
  // Paralelos: linhas horizontais de latitude.
  for(let lat=-75;lat<=75;lat+=15)
    linha(Array.from({length:91},(_,i)=>[lat,-180+i*4]));
  // Meridianos: linhas verticais de longitude.
  for(let lon=-180;lon<=180;lon+=15)
    linha(Array.from({length:46},(_,i)=>[-90+i*4,lon]));
  // lerp cria coordenadas intermédias para suavizar os continentes.
  for(let cont of continentes){
    let caminho=[];
    for(let i=0;i<cont.length-1;i++)
      for(let j=0;j<=8;j++)
        caminho.push([lerp(cont[i][0],cont[i+1][0],j/8),
                      lerp(cont[i][1],cont[i+1][1],j/8)]);
    linha(caminho,180,0.9);
  }
  // Desenha apenas os pontos brancos visíveis (z positivo).
  noStroke();
  for(let p of brancos){
    let q=projetar(p.lat,p.lon);
    if(q.z>0){fill(235,235,238,185);circle(q.x,q.y,1.5);}
  }
  // frameCount aumenta a cada frame; sin cria o brilho pulsante vermelho.
  for(let p of vermelhos){
    let q=projetar(p.lat,p.lon);
    if(q.z>0){
      noStroke();fill(229,35,50,30);circle(q.x,q.y,7);
      fill(229,35,50,190+65*sin(frameCount*.035+p.fase));
      circle(q.x,q.y,2.8);
    }
  }
  // Anéis decorativos exteriores.
  noFill();stroke(205);strokeWeight(1);circle(cx,cy,r*2);
  stroke(80);circle(cx,cy,(r+18)*2);circle(cx,cy,(r+34)*2);
  texto("02 / DISTRIBUIÇÃO GEOGRÁFICA",420,140,11,C);
  textAlign(CENTER);texto("MOVE O RATO SOBRE O GLOBO",cx,687,9);textAlign(LEFT);
}

// Desenha toda a interface: fundo, indicadores, análise e legenda.
function interfaceDashboard(){
  // Grelha de fundo com linhas espaçadas de 40 píxeis.
  stroke(35);strokeWeight(.5);
  for(let x=0;x<W;x+=40)line(x,0,x,H);
  for(let y=0;y<H;y+=40)line(0,y,W,y);
  texto("PERSEGUIÇÃO DE CRISTÃOS",40,49,22,C);
  texto("WORLD WATCH LIST / "+ano,40,75,10,R);
  textAlign(RIGHT);texto("VISUALIZAÇÃO INTERATIVA",1390,49);textAlign(LEFT);
  stroke(90);line(40,100,1390,100);
  texto("01 / INDICADORES GLOBAIS",40,140,11,C);

  // forEach percorre os 9 indicadores e desenha cada um.
  // O indicador selecionado recebe um fundo vermelho transparente.
  dados.forEach((d,i)=>{
    let y=185+i*57;
    if(i===sel){noStroke();fill(229,35,50,30);rect(35,y-16,285,50);}
    texto(d[0],40,y,9,i===sel?R:G);
    texto(d[1],40,y+23,19,C);
    stroke(65);line(40,y+35,320,y+35);
  });

  // Painel direito: valor selecionado e países ilustrativos.
  texto("03 / ANÁLISE SELECIONADA",1090,140,11,C);
  stroke(90);line(1090,160,1390,160);
  texto(dados[sel][1],1090,218,30,R);
  texto(dados[sel][0],1090,245,10,C);
  texto("REGIÕES REPRESENTADAS",1090,310);
  regioes[sel].forEach((id,i)=>{
    let y=339+i*22;noStroke();fill(...R);circle(1094,y,3);
    texto(paises[id][0],1107,y+4,10,C);
  });
  texto("LOCALIZAÇÕES ILUSTRATIVAS",1090,665,9);

  // Legenda: explica quanto representa cada ponto.
  stroke(90);line(420,735,1030,735);
  texto("04 / POPULAÇÃO CRISTÃ MUNDIAL",420,755,10,C);
  texto(fmt(total),420,784,18,C);
  noStroke();fill(...C);circle(760,764,5);
  texto("1 PONTO BRANCO = 1 MILHÃO",773,768,9);
  fill(...R);circle(760,789,5);
  texto("1 PONTO VERMELHO = "+fmt(escV),773,793,9);

  // Calcula a percentagem de perseguidos relativamente ao total.
  let percentagem=dados[0][2]/total*100;
  texto(percentagem.toFixed(1).replace(".",",")+"% SOB PERSEGUIÇÃO",1090,746,11,C);
  noStroke();fill(65);rect(1090,767,290,5);
  fill(...R);rect(1090,767,290*constrain(percentagem/100,0,1),5);
  texto("FONTE: OPEN DOORS / WWL "+ano,40,784,9);
  texto("ATUALIZAÇÃO: "+atualizado,40,803,9);
  textAlign(RIGHT);texto(estado,1390,803,9);textAlign(LEFT);
}

// draw executa continuamente e atualiza a animação.
// map transforma a posição do rato em ângulos; lerp suaviza a rotação.
// push/pop isolam a escala para não alterar os restantes cálculos.
function draw(){
  background(3,3,5);
  s=min(width/W,height/H);ox=(width-W*s)/2;oy=(height-H*s)/2;
  let mx=(mouseX-ox)/s,my=(mouseY-oy)/s;
  if(dist(mx,my,cx,cy)<r){
    ay=map(mx,cx-r,cx+r,-PI,PI);
    ax=map(my,cy-r,cy+r,-PI/3,PI/3);
  }
  rx=lerp(rx,ax,.045);
  ry+=atan2(sin(ay-ry),cos(ay-ry))*.045;
  push();translate(ox,oy);scale(s);
  interfaceDashboard();globo();pop();
}

// Executa quando clicamos no rato.
// Verifica qual indicador foi escolhido, atualiza os pontos vermelhos
// e orienta o globo para uma região associada ao indicador.
function mousePressed(){
  let mx=(mouseX-ox)/s,my=(mouseY-oy)/s;
  if(mx>=40&&mx<=320)
    for(let i=0;i<dados.length;i++){
      let y=185+i*57;
      if(my>=y-16&&my<=y+34){
        sel=i;criarVermelhos();
        let p=paises[regioes[i][0]];
        ay=-radians(p[2]);ax=-radians(p[1]*.4);
        return;
      }
    }
}

// Ajusta o canvas quando a janela muda de tamanho.
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  pixelDensity(min(displayDensity(),2));
}
