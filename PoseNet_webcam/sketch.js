let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
  
  // image(video, 0, 0, width, height);
  // strokeWeight(2);

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    let pose = poses[0].pose;
    // Create a pink ellipse for the nose
    fill(213, 0, 143);
    let nose = pose['nose'];
    ellipse(nose.x, nose.y, 30, 30);

    // Create a yellow ellipse for the right eye
    fill(255, 215, 0);
    let rightEye = pose['rightEye'];
    ellipse(rightEye.x, rightEye.y, 20, 20);

    // Create a yellow ellipse for the right eye
    fill(255, 215, 0);
    let leftEye = pose['leftEye'];
    ellipse(leftEye.x, leftEye.y, 20, 20);



    // text(nose.x+" : "+nose.y, nose.x, nose.y);
    // if(nose.y > 336 && nose.x <315){
    //   alert("อิอิ");
    // }else{

    // }
  }

  fill(255, 0, 0);
  ellipse(307, 343, 40, 40);

  // alert(atan2(180,0));
}
