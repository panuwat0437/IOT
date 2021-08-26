   // Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Object Detection using COCOSSD
This example uses a callback pattern to create the classifier
=== */


let detector;
let detections = [];
var imageStream = null;
function setup() {
  createCanvas(740, 480);
  CAMERA_URL = "http://131.95.3.162:80/mjpg/video.mjpg";
  imageStream = createImg(CAMERA_URL,"stream","",videoReady);
  imageStream.hide();
}

function videoReady() {
  // Models available are 'cocossd', 'yolo'
  detector = ml5.objectDetector('cocossd', modelReady);
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(imagseStream, gotDetections);
}

function modelReady() {
  detector.detect(imageStream, gotDetections);
}

function draw() {
  image(imageStream, 0, 0);

  for (let i = 0; i < detections.length; i += 1) {
    const object = detections[i];
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(24);
    text(object.label, object.x + 10, object.y + 24);
  }
}