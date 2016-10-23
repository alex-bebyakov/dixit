var path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  Rx = require('rxjs'),
  Immutable = require('immutable');

var usersMap = Immutable.Map({});
var app = express();
var testUser = {username: 'User'};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/", express.static(path.join(__dirname, 'client')));
app.use("/game", express.static(path.join(__dirname, 'client')));
app.use("/login", express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client')));
var server = app.listen(5002);
var io = require('socket.io')(server);


var sourceConnect = Rx.Observable.create(function (observer) {
  io.on('connection', function (socket) {
    socket.emit('socketId', {'socketId': socket.id, 'connectTime': Date.now()});
    socket.on('client connect', function (data) {
      observer.next({'socket': socket, 'data': data, 'event': 'client connect'});
    });
  });
  return function () {
    io.close();
  }
});

var sourceDisconnect = Rx.Observable.create(function (observer) {
  io.on('connection', function (socket) {
    socket.on('disconnect', function (data) {
      observer.next({'socketId': socket.id, 'event': 'client disconnect'});
    });
  });
  return function () {
    io.close();
  }
});

var observerConnect = sourceConnect
  .subscribe(function (obj) {
    var socketId = obj.data.socketId;
    usersMap = usersMap.set(socketId, obj.data);
    console.log(obj.event);
    console.log(socketId);
    io.emit('usersMap', usersMap.toArray());
  });

var observerDisconnect = sourceDisconnect
  .subscribe(function (obj) {
    var socketId = obj.socketId;
    var user = usersMap.get(socketId);
    usersMap = usersMap.delete(obj.socketId);
    console.log(obj.event);
    console.log(socketId);
    io.emit('usersMap', usersMap.toArray());
  });

app.post('/api/authenticate', function (req, res) {
  if (req.body.username === testUser.username) {
    res.status(200).send({token: 'userLogIn'});
  } else {
    res.status(200).send({});
  }
});
