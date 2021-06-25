#define BLYNK_PRINT Serial
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

//DHT22
#include "DHT.h"
#define DHTPIN 2     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);

//Sensor TCR5000
const int digital_pin = 0;

char auth[] = "cdshcrhWymXT2jl8JHmfPKKFDaf2vBja";
char ssid[] = "Kruhong";
char pass[] = "panuwat1234567";


void setup()
{
  Serial.begin(9600);
  Blynk.begin(auth, ssid, pass, "blynk.iot-cm.com", 8080);
  Serial.println("DHT22 testxxxxx!");
  dht.begin();
  pinMode(digital_pin,INPUT);
}

void loop()
{
  Blynk.run();
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.println(" *C ");
  
  Blynk.virtualWrite(V0, h);
  Blynk.virtualWrite(V1, t);

   
  int sensorValue = digitalRead(digital_pin);
  Serial.println(sensorValue);
  Blynk.virtualWrite(V3, sensorValue);
  delay(1);    
}
