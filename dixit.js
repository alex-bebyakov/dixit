var path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  Rx = require('rxjs'),
  Immutable = require('immutable');

var usersMap = Immutable.Map({});
var app = express();
var usersNames = ["Alex", "TimOFey", "DeBook", "Rocket", "Batux", "Groove"];
var usersAvatars = Immutable.Map({
    Alex: "assets/images/avatar-default-1.jpg",
    DeBook: "assets/images/avatar-default-2.jpg",
    TimOFey: "assets/images/avatar-default-3.jpg",
    Rocket: "assets/images/avatar-default-4.jpg",
    Batux: "assets/images/avatar-default-5.jpg",
    Groove: "assets/images/avatar-default-6.jpg"
});

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
      var data = obj.data;
      data["token"] = "newUser";
      usersMap.toArray().forEach(function (element) {
          if (element.username === obj.data.username) {
              data["token"] = "userExist";
          }
      })
      data["avatarImg"] = usersAvatars.get(obj.data.username)
      console.log(data);
      usersMap = usersMap.set(obj.data.socketId, data);
      console.log(data);
    io.emit('usersMap', usersMap.toArray());
  });

var observerDisconnect = sourceDisconnect
  .subscribe(function (obj) {
    var socketId = obj.socketId;
    var user = usersMap.get(socketId);
    usersMap = usersMap.delete(obj.socketId);
    io.emit('usersMap', usersMap.toArray());
  });

app.post('/api/authenticate', function (req, res) {
    isUserInAuthList = false;
    usersNames.forEach(function (username) {
        if (req.body.username === username) {
            isUserInAuthList = true;
        }
    })

    if (isUserInAuthList) {
        res.status(200).send({token: 'userLogIn'});
    } else {
        res.status(200).send({});
    }

});
