let handPose;
let video;
let hands = [];

function preload() {
  // Cargar el modelo HandPose
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  createCanvas(640, 480);

  // Crear el video y ocultarlo
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // Iniciar la detección de manos
  handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  // Guardar los resultados en la variable hands
  hands = results;

  // Volver a iniciar la detección
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Dibujar el video en el lienzo
  image(video, 0, 0, width, height);

  // Dibujar los puntos clave de cada mano detectada
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(width - keypoint.x, keypoint.y, 10);
    }
  }
}
