var m = require('mraa');
var led = new m.Pwm(3,false,-1);
led.enable(true);
led.write(0);
led.period_us(2000);
var express = require('express');
var app = express();

app.get('/0', function(req,res){
       led.write(1);
        console.log('up');
        res.send('UP');
});

app.get('/1',function(req,res){
        led.write(0);
        console.log('down');
        res.send('DOWN');


});

var server = app.listen(3000, function () {
                                           
  var host = server.address().address;
  var port = server.address().port;   
                                   
  console.log('Example app listening at http://%s:%s', host, port);
}); 