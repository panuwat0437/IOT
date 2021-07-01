#include <WiFi.h>
#include <PubSubClient.h>

#define WIFI_STA_NAME "Kruhong"
#define WIFI_STA_PASS "panuwat1234567"

#define MQTT_SERVER   "soldier.cloudmqtt.com"
#define MQTT_PORT     10174
#define MQTT_USERNAME "brdhfcif"
#define MQTT_PASSWORD "gviTCGqRHgB9"
#define MQTT_NAME     "ESP32_1"

#define relay1 2
#define relay2 3

WiFiClient client;
PubSubClient mqtt(client);

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  String topic_str = topic, msg = (char*)payload;
  Serial.println("[" + topic_str + "]: " + msg);
  
   if (msg == "GET") {
    mqtt.publish("/ESP/LED", (digitalRead(relay1) ? "relay1_on" : "relay1_off"));
    mqtt.publish("/ESP/LED", (digitalRead(relay2) ? "relay2_on" : "relay2_off"));
    return;
  }

  digitalWrite(relay1, (msg == "relay1_on" ? HIGH : LOW));
  digitalWrite(relay2, (msg == "relay2_on" ? HIGH : LOW));
  Serial.println(msg);
}

void setup() {
  Serial.begin(115200);
//  pinMode(LED_BUILTIN, OUTPUT);
//  pinMode(LED_PIN, OUTPUT);
  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_STA_NAME);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_STA_NAME, WIFI_STA_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  mqtt.setServer(MQTT_SERVER, MQTT_PORT);
  mqtt.setCallback(callback);
}

void loop() {
  if (mqtt.connected() == false) {
    Serial.print("MQTT connection... ");
    if (mqtt.connect(MQTT_NAME, MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
      mqtt.subscribe("/ESP/LED");
    } else {
      Serial.println("failed");
      delay(5000);
    }
  } else {
    mqtt.loop();
  }
}
