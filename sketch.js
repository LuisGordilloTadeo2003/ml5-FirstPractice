let handPose;
let video;
let hands = [];
let isDetecting = false;

//Variables generales
let widthG = 640;
let heightG = 480;

//Variables carretera
let topBase = widthG / 4;
let bottomBase = widthG / 2;
let distanceTopBase = widthG / 8;
let distanceBottomBase = widthG / 8;

//Variables volante
let volante;
let volanteX = widthG / 2;
let volanteY = heightG;
let volanteDiametro = widthG / 3;
let angle = 0; // Variable para almacenar el ángulo

//Variables coches
let cochePersonal;

function preload() {
  // Cargar el modelo handPose y asegurarse de que esté listo
  handPose = ml5.handPose({ flipped: true }, modelReady);
  volante = loadImage("./Volante.png");
}

function setup() {
  createCanvas(widthG, heightG);

  // Crear la captura de video y ocultarla
  video = createCapture(VIDEO, videoReady); // Asegúrate de que la función videoReady se llame cuando el video esté listo
  video.size(widthG, heightG);
  video.hide();
}

function videoReady() {
  console.log("Video listo para la detección.");
  handPose.detectStart(video, gotHands); // Llama a detectStart aquí
  isDetecting = true;
}

function modelReady() {
  console.log("Modelo cargado correctamente");
  // La detección ya se inicia en videoReady
}

function gotHands(results) {
  // Guardar los resultados en la variable 'hands'
  hands = results;
}

function setup() {
  createCanvas(widthG, heightG);
  // Crear la captura de video y ocultarla
  video = createCapture(VIDEO, { flipped: true });
  video.size(widthG, heightG);
  video.hide();

  cochePersonal = new CochePersonal(widthG / 2 + distanceBottomBase);
}

function draw() {
  background(0, 100, 0);

  // Dibujar el video
  imageMode(CORNER);
  image(video, 0, 0, width / 4, height / 4);

  // Dibuja el trapecio
  dibujarMapa(width / 2, height / 2, topBase, bottomBase, heightG);

  // Dibujar el volante
  push();
  imageMode(CENTER);
  translate(volanteX, volanteY); // Mover al centro del volante
  rotate(angle); // Rotar el volante según el ángulo calculado
  image(volante, 0, 0, volanteDiametro, volanteDiametro); // Dibujar el volante
  pop();

  cochePersonal.display();

  // Verificar si hay dos manos detectadas
  if (hands.length === 2) {
    fill(255, 0, 0);
    noStroke();

    // Dibujar círculos en los pulgares
    let thumb1 = hands[0].keypoints[4];
    let thumb2 = hands[1].keypoints[4];

    circle(width - thumb1.x, thumb1.y, 20);
    circle(width - thumb2.x, thumb2.y, 20);

    // Calcular el ángulo entre los pulgares
    let deltaX = thumb1.x - thumb2.x; // Diferencia en x
    let deltaY = thumb1.y - thumb2.y; // Diferencia en y

    angle = atan2(deltaY, deltaX); // Ángulo en radianes

    // Si deseas que el volante gire dependiendo de la distancia entre los pulgares
    // Puedes ajustar la velocidad de rotación aquí
    angle *= 0.5; // Ajusta la velocidad de rotación

  } else {
    // Si no hay dos manos, puedes establecer un valor predeterminado para el ángulo
    angle = 0; // Esto detendría el giro del volante si no hay manos
  }

  // Puedes descomentar el siguiente bloque para dibujar todos los puntos de las manos rastreadas
  /*
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(width - keypoint.x, keypoint.y, 10);
    }
  }
  */
}


// Alternar la detección cuando se presione el mouse
function mousePressed() {
  toggleDetection();
}

function toggleDetection() {
  if (isDetecting) {
    handPose.detectStop();
    isDetecting = false;
  } else {
    handPose.detectStart(video, gotHands);
    isDetecting = true;
  }
}

function dibujarMapa(x, y, topBase, bottomBase, height) {
  // Dibujar el trapecio
  beginShape();
  fill(30);
  strokeWeight(2);
  stroke(211, 211, 211);

  // Vértice superior izquierdo
  vertex(x - topBase / 2, y - height / 2);

  // Vértice superior derecho
  vertex(x + topBase / 2, y - height / 2);

  // Vértice inferior derecho
  vertex(x + bottomBase / 2, y + height / 2);

  // Vértice inferior izquierdo
  vertex(x - bottomBase / 2, y + height / 2);

  endShape(CLOSE); // Cerrar la forma

  // Dibuja las líneas de carriles
  stroke(255); // Color de las líneas
  strokeWeight(2); // Grosor de las líneas
  let laneCount = 4; // Número de carriles
  let topQuarterWidth = topBase / 4; // Ancho del cuartil superior

  // Línea central
  line(x, y - height / 2, x, y + height / 2); // Línea central vertical

  // Líneas inclinadas
  for (let i = 1; i < laneCount; i++) {
    let posX = x - topBase / 2 + i * topQuarterWidth; // Posición de las líneas inclinadas

    // Línea discontinua
    drawingContext.setLineDash([10, 10]); // Línea discontinua de 10px

    // Dibuja línea desde el topBase hasta el bottomBase
    line(posX, y - height / 2, map(posX, x - topBase / 2, x + topBase / 2, x - bottomBase / 2, x + bottomBase / 2), y + height / 2);
  }

  // Restablecer el estilo de línea a continuo
  drawingContext.setLineDash([]);
}
