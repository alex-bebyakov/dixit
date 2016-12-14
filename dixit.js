var express = require("express");
var app = express();
var port = process.env.PORT || 5002;

var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

var io = require('socket.io')(server);

require('./server/config/express')(app,__dirname);
require('./server/services/socket.service')(io);
require('./server/config/routes')(app,io);
