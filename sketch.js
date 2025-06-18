let caminhao;
let fazenda;
let cidade;
let carregando = false;
let jogoFinalizado = false;
let faseAtual = 1;
let maxFases = 8;
let obstaculos = [];
let carros = [];
let buracos = [];
let chuvaAtiva = false;
let vidas = 3;
let gotasChuva = [];

function setup() {
  createCanvas(900, 500);
  iniciarFase();
  iniciarChuva();
}

function iniciarFase() {
  caminhao = createVector(100, 400);
  fazenda = createVector(100, 400);
  cidade = createVector(700, 80);
  carregando = false;
  jogoFinalizado = false;
  obstaculos = [];
  carros = [];
  buracos = [];
  chuvaAtiva = false;

  // Quantidade crescente de obstáculos e carros
  let qtdObs = faseAtual + 2;
  for (let i = 0; i < qtdObs; i++) {
    obstaculos.push(createVector(random(200, 700), random(100, 400)));
  }

  let qtdCarros = faseAtual + 1;
  for (let i = 0; i < qtdCarros; i++) {
    let y = random(150, 400);
    let dir = random([1, -1]);
    carros.push({
      pos: createVector(dir === 1 ? -100 : width + 100, y),
      dir: dir,
      speed: random(2 + faseAtual * 0.5, 4 + faseAtual)
    });
  }

  // Buracos só começam a partir da fase 4
  if (faseAtual >= 4) {
    let qtdBuracos = faseAtual;
    for (let i = 0; i < qtdBuracos; i++) {
      buracos.push(createVector(random(200, 700), random(120, 400)));
    }
  }

  // Chuva ativa a partir da fase 5
  chuvaAtiva = faseAtual >= 5;
}

function draw() {
  background(200, 255, 200);
  if (chuvaAtiva) desenharChuva();
  desenharEstradaDiagonal();
  desenharFazenda();
  desenharCidade();
  desenharObstaculos();
  desenharBuracos();
  desenharCarros();
  desenharCaminhao();

  if (jogoFinalizado) {
    mostrarMensagemFinal();
    return;
  }

  moverCaminhao();
  moverCarros();
  mostrarInstrucoes();
  verificarColisoes();
  mostrarVidas();
}

function desenharEstradaDiagonal() {
  stroke(120, 90, 40);
  strokeWeight(60);
  if (faseAtual >= 4) {
    noFill();
    stroke(120, 90, 40);
    strokeWeight(60);
    line(fazenda.x + 50, fazenda.y + 30, cidade.x + 65, cidade.y + 45);
    for (let buraco of buracos) {
      fill(100, 70, 30);
      noStroke();
      ellipse(buraco.x, buraco.y, 30, 30);
    }
  } else {
    stroke(120, 90, 40);
    strokeWeight(60);
    line(fazenda.x + 50, fazenda.y + 30, cidade.x + 65, cidade.y + 45);
  }
  noStroke();
}

function desenharFazenda() {
  fill(100, 200, 100);
  rect(fazenda.x, fazenda.y, 100, 60);
  fill(0);
  textSize(14);
  text("FAZENDA", fazenda.x + 10, fazenda.y + 75);
}

function desenharCidade() {
  fill(180, 180, 250);
  rect(cidade.x, cidade.y, 130, 90);
  fill(0);
  textSize(14);
  text("CIDADE", cidade.x + 30, cidade.y + 110);
  fill(255, 200, 0);
  ellipse(cidade.x + 60, cidade.y - 20, 30, 30);
  fill(255, 0, 0);
  textSize(12);
  text("Festa Junina!", cidade.x + 10, cidade.y - 30);
}

function desenharCaminhao() {
  push();
  translate(caminhao.x, caminhao.y);
  if (carregando) {
    fill(150, 75, 0);
    rect(-45, 5, 40, 25, 4);
  }
  fill(200, 0, 0);
  rect(0, 5, 50, 25, 5);
  fill(220, 0, 0);
  rect(40, 0, 20, 30, 5);
  fill(135, 206, 235);
  rect(45, 5, 10, 10, 3);
  fill(0);
  ellipse(10, 33, 14, 14);
  ellipse(45, 33, 14, 14);
  pop();
}

function desenharObstaculos() {
  fill(80, 50, 0);
  for (let obs of obstaculos) {
    rect(obs.x, obs.y, 30, 30);
  }
}

function desenharBuracos() {
  fill(100, 70, 30);
  for (let buraco of buracos) {
    ellipse(buraco.x, buraco.y, 30, 30);
  }
}

function desenharCarros() {
  for (let carro of carros) {
    push();
    translate(carro.pos.x, carro.pos.y);
    let cores = [
      color(0, 100, 255),
      color(255, 0, 0),
      color(0, 200, 100),
      color(255, 165, 0),
      color(150, 0, 255)
    ];
    fill(cores[carros.indexOf(carro) % cores.length]);
    rect(0, 0, 60, 30, 5);
    fill(135, 206, 235);
    rect(10, 5, 15, 10, 3);
    rect(35, 5, 15, 10, 3);
    fill(0);
    ellipse(10, 32, 12, 12);
    ellipse(50, 32, 12, 12);
    fill(255, 255, 100);
    if (carro.dir === 1) {
      ellipse(60, 10, 6, 6);
      ellipse(60, 20, 6, 6);
    } else {
      ellipse(0, 10, 6, 6);
      ellipse(0, 20, 6, 6);
    }
    pop();
  }
}

function moverCaminhao() {
  if (keyIsDown(87)) caminhao.y -= 3;
  if (keyIsDown(83)) caminhao.y += 3;
  if (keyIsDown(65)) caminhao.x -= 3;
  if (keyIsDown(68)) caminhao.x += 3;
  caminhao.x = constrain(caminhao.x, 0, width - 50);
  caminhao.y = constrain(caminhao.y, 0, height - 35);
}

function moverCarros() {
  for (let carro of carros) {
    carro.pos.x += carro.dir * carro.speed;
    if (carro.dir === 1 && carro.pos.x > width + 100) {
      carro.pos.x = -100;
    } else if (carro.dir === -1 && carro.pos.x < -100) {
      carro.pos.x = width + 100;
    }
  }
}

function verificarColisoes() {
  for (let obs of obstaculos) {
    if (colideRetangulo(caminhao, obs, 50, 30, 30, 30)) {
      perderVida("Você bateu em um obstáculo!");
    }
  }
  for (let carro of carros) {
    if (colideRetangulo(caminhao, carro.pos, 50, 30, 60, 30)) {
      perderVida("Você foi atingido por um carro!");
    }
  }
  for (let buraco of buracos) {
    if (colideCirculoRetangulo(buraco, 15, caminhao, 50, 30)) {
      perderVida("Você caiu em um buraco!");
    }
  }
}

function perderVida(msg) {
  vidas--;
  if (vidas <= 0) {
    alert(msg + " Você perdeu todas as vidas! Reiniciando o jogo.");
    faseAtual = 1;
    vidas = 3;
    iniciarFase();
    loop();
  } else {
    alert(msg + " Você perdeu uma vida! Vidas restantes: " + vidas);
    iniciarFase();
  }
}

function colideRetangulo(aPos, bPos, aW, aH, bW, bH) {
  return (
    aPos.x < bPos.x + bW &&
    aPos.x + aW > bPos.x &&
    aPos.y < bPos.y + bH &&
    aPos.y + aH > bPos.y
  );
}

function colideCirculoRetangulo(cPos, cR, rPos, rW, rH) {
  let testX = cPos.x;
  let testY = cPos.y;
  if (cPos.x < rPos.x) testX = rPos.x;
  else if (cPos.x > rPos.x + rW) testX = rPos.x + rW;
  if (cPos.y < rPos.y) testY = rPos.y;
  else if (cPos.y > rPos.y + rH) testY = rPos.y + rH;

  let distX = cPos.x - testX;
  let distY = cPos.y - testY;
  let distance = sqrt(distX * distX + distY * distY);

  return distance <= cR;
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    if (!carregando && colideRetangulo(caminhao, fazenda, 50, 30, 100, 60)) {
      carregando = true;
    } else if (carregando && colideRetangulo(caminhao, cidade, 50, 30, 130, 90)) {
      carregando = false;
      if (faseAtual < maxFases) {
        faseAtual++;
        iniciarFase();
      } else {
        jogoFinalizado = true;
      }
    }
  }
}

function mostrarMensagemFinal() {
  background(0, 150, 255);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("Muito obrigado por ter entregado a carga!", width / 2, height / 2);
  noLoop();
}

function mostrarInstrucoes() {
  fill(0);
  textSize(16);
  text("Fase: " + faseAtual + " / " + maxFases, 20, 20);
  text("Vidas: " + vidas, 20, 40);
  text("Use W A S D para mover o caminhão", 20, 60);
  if (chuvaAtiva) {
    text("Está chovendo! Dirija com cuidado.", 20, 80);
  }
  if (!carregando && colideRetangulo(caminhao, fazenda, 50, 30, 100, 60)) {
    text("Pressione 'E' para pegar a carga na fazenda", 20, 110);
  } else if (carregando && colideRetangulo(caminhao, cidade, 50, 30, 130, 90)) {
    text("Pressione 'E' para entregar a carga na cidade", 20, 110);
  } else if (carregando) {
    text("Leve a carga até a cidade", 20, 110);
  } else {
    text("Vá até a fazenda para pegar a carga", 20, 110);
  }
}

function mostrarVidas() {
  fill(255, 0, 0);
  textSize(18);
  text("Vidas restantes: " + vidas, width - 180, 30);
}

// --- Chuva com pequenos riscos ---

function iniciarChuva() {
  for (let i = 0; i < 200; i++) {
    gotasChuva.push({
      x: random(width),
      y: random(height),
      length: random(10, 20),
      speed: random(4, 10)
    });
  }
}

function desenharChuva() {
  stroke(150, 150, 255, 180);
  strokeWeight(2);
  for (let g of gotasChuva) {
    line(g.x, g.y, g.x + 3, g.y + g.length);
    g.y += g.speed;
    g.x += 1; // ligeira inclinação na chuva
    if (g.y > height) {
      g.y = random(-20, 0);
      g.x = random(width);
    }
  }
}