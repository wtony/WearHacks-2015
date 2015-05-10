int mspeed = 190;

void setup(){
  Serial.begin (9600);
  //pinMode(2, INPUT);
  //pinMode(3, INPUT);
  pinMode(8, INPUT);
  pinMode(11, OUTPUT);
  //pinMode(12, OUTPUT);
  analogWrite(11, mspeed);
  
}

void loop(){
  
  if(digitalRead(8) == HIGH){
    analogWrite(11, 210);
    Serial.println("ON");
    //delay(200);
  } else if (digitalRead(8) == LOW){
    analogWrite(11, 190);
    Serial.println("OFF");
    //delay(200);
  }
  delay (50);
}
