const int digital_pin = 0;
void setup() {
  Serial.begin(9600);
  pinMode(digital_pin,INPUT);
}

void loop() {
  int sensorValue = digitalRead(digital_pin);
  Serial.println(sensorValue);
  delay(1);    
}
