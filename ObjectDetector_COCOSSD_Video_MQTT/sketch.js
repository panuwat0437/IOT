let config = {
  mqtt_server: "driver.cloudmqtt.com",
  mqtt_websockets_port: 38672,
  mqtt_user: "qurygeum",
  mqtt_password: "vDKjrZ5FpIHJ",
};

$(document).ready(function (e) {
  document.querySelector("#door-status").classList.add("bg-gray-500");

  client = new Paho.MQTT.Client(
    config.mqtt_server,
    config.mqtt_websockets_port,
    "web_" + parseInt(Math.random() * 100, 10)
  );
  client.connect({
    useSSL: true,
    userName: config.mqtt_user,
    password: config.mqtt_password,
    onSuccess: function () {
      $("#status").text("Connected").removeClass().addClass("connected");
      client.subscribe("/relay");
      mqttSend("/relay", "Connected");
    },
    onFailure: function (e) {
      $("#status")
        .text("Error : " + e)
        .removeClass()
        .addClass("error");
    },
  });
  client.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
      $("#status")
        .text("onConnectionLost:" + responseObject.errorMessage)
        .removeClass()
        .addClass("connect");
      setTimeout(function () {
        client.connect();
      }, 1000);
    }
  };
});

function mqttSend(topic, msg) {
  let message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
}


let video;
let detector;
let detections = [];
let label = "waiting...";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Models available are 'cocossd', 'yolo'
  detector = ml5.objectDetector('cocossd', modelReady);
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}

function modelReady() {
  detector.detect(video, gotDetections);
}

function draw() {
  image(video, 0, 0,640, 480);

  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    console.log(object.confidence);
    noStroke();
    fill(255);
    strokeWeight(2);
    text(object.label+" ("+object.confidence+")", object.x + 10, object.y + 24);
    
    noFill();
    strokeWeight(3);
    document.querySelector("#user").innerHTML = object.label;
    if (object.label === 'person') {
      stroke(0, 255, 0);
      mqttSend("/relay", "relay1_on");
    document.querySelector("#door-status").classList.remove("bg-red-500");
    document.querySelector("#door-status").classList.add("bg-green-600");
    document.querySelector("#door-status").innerHTML = "Allow";
    document.querySelector(
      "#door-icon"
    ).innerHTML = `<i class="fas fa-door-open"></i>`;
    document.querySelector("#text-status").innerHTML =
      "✅✅ ท่านสามารถเข้าบ้านได้ ✅✅";
      rect(object.x/2, object.y, object.width/2, object.height);
    } else {
      stroke(0, 0, 255);
      mqttSend("/relay", "relay1_off");
      document.querySelector("#door-status").classList.remove("bg-green-600");
      document.querySelector("#door-status").classList.add("bg-red-500");
      document.querySelector("#door-status").innerHTML = "Can't Access";
      document.querySelector("#text-status").innerHTML =
        "❌❌ ไม่อนุญาตให้เข้าบ้าน ❌❌";
      document.querySelector(
        "#door-icon"
      ).innerHTML = `<i class="fas fa-door-closed"></i>`;
      rect(object.x/2, object.y, object.width/2, object.height);
    }
    
    
  }
}
