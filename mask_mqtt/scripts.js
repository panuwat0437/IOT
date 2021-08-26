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
      client.subscribe("/Boomzaza");
      mqttSend("/Boomzaza", "Connected");
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
let label = "waiting...";
let classifier;
let modelURL = "https://teachablemachine.withgoogle.com/models/vyiENAZZL/";

function preload() {
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
  textAlign(CENTER, CENTER);
  createCanvas(800, 480);
  video = createCapture(VIDEO);
  video.hide();
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(video, gotResults);
}

function draw() {
  background(0);
  image(video, width / 2 - video.width / 2, 0);
  // textSize(24);
  // textAlign(CENTER, CENTER);
  // fill(255);
  // text(label, width / 2, height - 16);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo();

  document.querySelector("#user").innerHTML = label.split(" ")[1];

  if (label.includes("Masked")) {
    mqttSend("/Boomzaza", "relay1_on");
    document.querySelector("#door-status").classList.remove("bg-red-500");
    document.querySelector("#door-status").classList.remove("bg-gray-500");
    document.querySelector("#door-status").classList.add("bg-green-600");
    document.querySelector("#door-status").innerHTML = "Allow";
    document.querySelector(
      "#door-icon"
    ).innerHTML = `<i class="fas fa-door-open"></i>`;
    document.querySelector("#text-status").innerHTML =
      "✅✅ ท่านสามารถเข้าโรงเรียนได้ ✅✅";
    return;
  }

  mqttSend("/Boomzaza", "relay1_off");

  document.querySelector("#door-status").classList.remove("bg-green-600");
  document.querySelector("#door-status").classList.remove("bg-gray-500");
  document.querySelector("#door-status").classList.add("bg-red-500");
  document.querySelector("#door-status").innerHTML = "Can't Access";
  document.querySelector("#text-status").innerHTML =
    "❌❌ โปรดทำการใส่แมสก่อนเข้าโรงเรียน ❌❌";
  document.querySelector(
    "#door-icon"
  ).innerHTML = `<i class="fas fa-door-closed"></i>`;
}
