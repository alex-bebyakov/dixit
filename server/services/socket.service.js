const constants = require('../config/constants');
var gameService = require('../services/game.service');
const Rx = require('rxjs');
var usersMap = require('immutable').Map({});

module.exports = function (io) {
    const connectionThread = Rx.Observable.create(function (observer) {
        return connection(observer, io)
    });
    const disconnectionThread = Rx.Observable.create(function (observer) {
        return disconnection(observer, io)
    });
    connectionThread.subscribe(function (obj) {
        return connectUser(obj, io)
    });
    disconnectionThread.subscribe(function (obj) {
        return disconnectUser(obj, io)
    });
}

var connection = function (observer, io) {
    io.on('connection', function (socket) {
        socket.emit('socketId', {'socketId': socket.id, 'connectTime': Date.now()});
        socket.on('client connect', function (data) {
            observer.next({'socket': socket, 'data': data, 'event': 'client connect'});
        });
    });
    return function () {
        io.close();
    }
}

var disconnection = function (observer, io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function (data) {
            observer.next({'socketId': socket.id, 'event': 'client disconnect'});
        });
    });
    return function () {
        io.close();
    }
}

var disconnectUser = function (obj, io) {

    if (usersMap.isEmpty()) {
        gameService.reset();
    } else {
        if (usersMap.get(obj.socketId).token === "newUser") {
            gameService.removePlayer(usersMap.get(obj.socketId).username);
        }
        usersMap = usersMap.delete(obj.socketId);
        console.log("disconnect")
        console.log(usersMap.toArray())
        io.emit('usersMap', usersMap.toArray());
    }
}

var connectUser = function (obj, io) {
    var data = obj.data;
    data["token"] = "newUser";
    if (usersMap.size > 5) {
        data["token"] = "toManyUsers";
    }

    else {
        usersMap.toArray().forEach(function (element) {
            if (element.username === obj.data.username) {
                data["token"] = "userExist";
            }
        })
    }
    if (data["token"] === "newUser") {
        if (gameService.started()) {
            if (!gameService.isPlayerWasInGame(obj.data.username)) {
                data["token"] = "gameBegan";
            }
        }
        if (data["token"] === "newUser") {
            data["avatarImg"] = constants.Avatars.get(obj.data.username)
            gameService.addPlayer(obj.data.username);
        }
    }
    usersMap = usersMap.set(obj.data.socketId, data);
    console.log("connect")
    console.log(usersMap.toArray())
    io.emit('usersMap', usersMap.toArray());
}