

var Myo = require('../template/entry'),
    hub = new Myo.Hub();

var myMyo = Myo.create();
myMyo.on('fingers_spread', function(edge){
    if(!edge) return;
    alert('Hello Myo!');
    myMyo.vibrate();
});

    // if (frame.rotation) {
    //     console.log(frame.rotation.toString());
    // }

    // if (frame.pose && frame.pose.valid) {
    //     console.log(frame.pose.toString());
    // }

