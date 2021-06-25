#define BLYNK_PRINT Serial
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = "cdshcrhWymXT2jl8JHmfPKKFDaf2vBja";
char ssid[] = "Kruhong";
char pass[] = "panuwat1234567";

void setup()
{
  Serial.begin(9600);
  Blynk.begin(auth, ssid, pass, "blynk.iot-cm.com", 8080);
}

void loop()
{
  Blynk.run();
}
