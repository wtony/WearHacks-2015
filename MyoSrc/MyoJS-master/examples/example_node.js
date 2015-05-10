var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

var outputString;
color = 'FFFFFF';
Fist = false;

//console.log(outputString);
btSerial.on('found', function(address, name) {
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('connected');
            outputString = 'Hi';
            // var string='';
            // var mecolor ='FFFFFF';


                   setInterval(function() {

       // if(string!=outputString || mecolor!=color){
            // string = outputString;
            // mecolor = color;

            btSerial.write(new Buffer('b' + color + outputString, 'utf-8'), function(err, bytesWritten) {
                    if (err) console.log(err);
                });
           //  }
            console.log(outputString);
            console.log(color);
        }, 4000);

   

            btSerial.on('data', function(buffer) {
                console.log(buffer.toString('utf-8'));
            });
        }, function () {
            console.log('cannot connect');
        });

        // close the connection when you're ready
      //  btSerial.close();
    }, function() {
        console.log('found nothing');
    });
});

btSerial.inquire();

//global varibles

//first index is counter for actions, second and third index has to do with the interval between actions
tempArray={
    "Hi":[0,0], //wave in, wave out: "Hi"
    "What":[0,0], //wave in, fist: "What are your plans for the weekend?"
    "Happiness" :[0,0], //wave in, wave out: ":D"
    "Bye":[0,0], //wave out: "Bye"
    "How":[0,0], //wave out, wave in: "How are you doing?"
    "Ilu":[0,0], //wave out, fist: "I Love you?"
    "UofT":[0,0], //spread hands: "#HackitShipIt"
    "Smug":[0,0], //spread hands, wave in: ":/"
    "Sadness":[0,0], //spread hands, fist: ":("
    "Wut":[0,0], //spread hands, wave out, ":F"
    "rest":0,
    "fistRest":0
};

outputString = "";


//myo connection
var Myo = require('../template/entry'),
    hub = new Myo.Hub();
    // Myo.setLockingPolicy("none");

hub.on('ready', function() { console.log('ready'); });
hub.on('connect', function() { console.log('connected'); });
hub.on('disconnect', function() { console.log('disconnect'); });
hub.on('frame', function(frame) {
    //console.dir(frame);

    //if (frame.rotation) {
    //    console.log(frame.rotation.toString());
    //}

    //if (frame.pose && frame.pose.valid) {
    //    console.log(frame.pose.toString());
    //}
    
});
hub.on('pose', function(pose) {
    currentPose = pose;
    
    switch(currentPose.type) {
        //Fist
        case currentPose.POSE_FIST:
            console.log("fist");
            
            /*
            "What, Ilu, Sadness"
            */
            //console.log(tempArray.rest)
            //console.log(tempArray.What[1])
            if(tempArray.What[0] == 1 && (tempArray.rest - tempArray.What[1] <= 100)){
                console.log("What are you plans for the weekend?");
                outputString = "What are you plans for the weekend?"
                tempArray.What[0] = 0;
                tempArray.What[1] = 0;
            }
            else if(tempArray.Ilu[0] == 1 && (tempArray.rest - tempArray.Ilu[1] <= 100)){
                console.log("Want to go out tonight?");
                outputString = "Want to go out tonight?"
                tempArray.Ilu[0] = 0;
                tempArray.Ilu[1] = 0;
            }
            else if(tempArray.Sadness[0] == 1 && (tempArray.rest - tempArray.Sadness[1] <= 100)){
                console.log(":(");
                outputString = ":("
                tempArray.Sadness[0] = 0;
                tempArray.Sadness[1] = 0;
            }
            else{
                Fist = true;
                tempArray.fistRest = tempArray.rest;
            }
            break;
        //Wave in
        case currentPose.POSE_WAVE_IN:
            console.log("wave in");

            /*
            "Hi"
            //wave in, wave out: "Hi"
            */
            if(tempArray.Hi[0] == 0){
                tempArray.Hi[0] = tempArray.Hi[0] + 1
                tempArray.Hi[1] = tempArray.rest    
            }
            else{
                tempArray.Hi[1] = tempArray.rest
            }


            /*
            wave in, fist: "What are your plans for the weekend?"
            */
            if(tempArray.What[0] == 0){
                tempArray.What[0] = tempArray.What[0] + 1
                tempArray.What[1] = tempArray.rest  
            }
            else{
                tempArray.What[1] = tempArray.rest
            }

            /*
            "Smug"
            //spread hands, wave in: ":/"
            */
            //console.log("tempArray.rest = " + tempArray.rest)
            //console.log("tempArray.Smug[1] = " + tempArray.Smug[1])
            if(tempArray.Smug[0] == 1 && (tempArray.rest - tempArray.Smug[1] <= 100)){
                console.log("I love you");
                outputString = "I love you"
                tempArray.Smug[0] = 0;
                tempArray.Smug[1] = 0;
            }


            break;

        //Wave out
        case currentPose.POSE_WAVE_OUT:
            console.log("wave out");

            /*
            "Bye"
            */
            //console.log(tempArray.Hi)
            if(tempArray.Hi[0] == 0){
                console.log("Bye, nice meeting you");
                outputString = "Bye, nice meeting you"
            }
                    
            

            /*
            "Ilu"
            */
            if(tempArray.Ilu[0] == 0){
                tempArray.Ilu[0] = tempArray.Ilu[0] + 1

                tempArray.Ilu[1] = tempArray.rest
                //console.log(tempArray.Ilu[1])
            }
            else{
                tempArray.Ilu[1] = tempArray.rest
                //console.log(tempArray.Ilu[1])
            }

            /*
            "How"
            */
            if(tempArray.How[0] == 0){
                tempArray.How[0] = tempArray.How[0] + 1
                tempArray.How[1] = tempArray.rest;
            }
            else{
                tempArray.How[1] = tempArray.rest;
            }

            /*
            "Wut, "Hi"
            */
            //console.log("tempArray.rest = " + tempArray.rest)
            //console.log("tempArray.Wut[1] = " + tempArray.Wut[1])
            if(tempArray.Wut[0] == 1 && (tempArray.rest - tempArray.Wut[1] <= 100)){
                console.log("Node.js is the only real dev language");
                outputString = "Node.js is the only real dev language"
                tempArray.Wut[0] = 0;
                tempArray.Wut[1] = 0;
            }
            else if(tempArray.Hi[0] == 1 && (tempArray.rest - tempArray.Hi[1] <= 100)){
                console.log("Nearest Starbucks?");
                outputString = "Nearest Starbucks?"
                tempArray.Hi[0] = 0;
            }


            break;

        //Finger spread
        case currentPose.POSE_FINGERS_SPREAD:
        /*
        "Smug":[0,0], //spread hands, wave in: ":/"
        "Sadness":[0,0], //spread hands, fist: ":("
        "Wut":[0,0], //spread hands, wave out, ":F"
        */

            console.log("fingers spreading");
            //console.log("#HackitShipIt");

            /*
            "Smug"
            */
            if(tempArray.Smug[0] == 0){
                tempArray.Smug[0] = tempArray.Smug[0] + 1
                tempArray.Smug[1] = tempArray.rest;
            }
            else{
                tempArray.Smug[1] = tempArray.rest;
            }

            /*
            "Sadness"
            */
            if(tempArray.Sadness[0] == 0){
                tempArray.Sadness[0] = tempArray.Sadness[0] + 1
                tempArray.Sadness[1] = tempArray.rest;
            }
            else{
                tempArray.Sadness[1] = tempArray.rest;
            }

            /*
            "Wut"
            */
            if(tempArray.Wut[0] == 0){
                tempArray.Wut[0] = tempArray.Wut[0] + 1
                tempArray.Wut[1] = tempArray.rest;
            }
            else{
                tempArray.Wut[1] = tempArray.rest;
            }
            

           
            break;

        //Twist in
        case currentPose.POSE_TWIST_IN:
            console.log("twist in");
            break;


        //Nothing
        case currentPose.POSE_NONE:
        default:
	        //console.log("rest")
	        tempArray.rest = tempArray.rest + 1;
            if(tempArray.fistRest < (tempArray.rest - 60)){

                Fist = false;
                //console.log("Fist is false")
            }
            /*
            Check times in all sentence objects and if later than a 35 count, reduce them to zero
            */
            if(tempArray.Hi[1] < (tempArray.rest - 100)){
                tempArray.Hi[0] = 0;
            }
            if(tempArray.How[1] < (tempArray.rest - 100)){
                tempArray.How[1] = 0;
            }
            if(tempArray.What[1] < (tempArray.rest - 100)){
                tempArray.What[1] = 0;
            }
            if(tempArray.Ilu[1] < (tempArray.rest - 100)){
                tempArray.Ilu[1] = 0;
            }   
            if(tempArray.Sadness[1] < (tempArray.rest - 100)){
                tempArray.Sadness[1] = 0;
            }       
            if(tempArray.Wut[1] < (tempArray.rest - 100)){
                tempArray.Wut[1] = 0;
            }       
            if(tempArray.Smug[1] < (tempArray.rest - 100)){
                tempArray.Smug[1] = 0;
            }                
            break;
    }

});


 //////////////////////////color///////////

hub.on('frame', function(frame) {
    //console.log();
    var xRotate = Math.abs(frame.rotation.x);
     if(Fist){
  //  console.dir(frame);
     
    if (frame.rotation ) {
        if(xRotate>0 && xRotate<0.20 ){
            color = 'FFFFFF';
           console.log("color is white");
        }
        
         if(xRotate>0.20 && xRotate<0.25){
           color = 'FF0000';
            console.log("color is  RED");
        }
        if(xRotate>0.25 && xRotate<0.35){
             color = '00ff00';
            console.log("color is  Green");
        }
         if(xRotate>0.35 && xRotate<0.5){
             color = '0000ff';
            console.log("color is  Blue");
        }
        if(xRotate>0.5){
             color = 'FFFFFF';
            console.log("color is  still while, WHITE, try something new");
        }

     }


    }

    if (frame.pose && frame.pose.valid) {
      //  console.log(frame.pose.toString());
    }
});