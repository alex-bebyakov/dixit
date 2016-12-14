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
        socket.on('app connect', function (data) {
            observer.next({'socket': socket, 'data': data, 'event': 'app connect'});
        });
    });
    return function () {
        io.close();
    }
}

var disconnection = function (observer, io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function (data) {
            observer.next({'socketId': socket.id, 'event': 'app disconnect'});
        });
    });
    return function () {
        io.close();
    }
}

var disconnectUser = function (obj, io) {
    if (usersMap.get(obj.socketId)) {
        if (usersMap.get(obj.socketId).token === "newUser") {
            gameService.removePlayer(io, obj.socketId);
        }
        usersMap = usersMap.delete(obj.socketId);
        usersMap.forEach(function (value, key) {
            var data=value;
            data["no"]=gameService.players().get(key).no
            data["color"] = constants.Colors[gameService.players().get(key).no];
            usersMap=usersMap.set(key,data)
            console.log(data)
        })
    }

    if (usersMap.isEmpty()) {
        gameService.reset();
    } else {
        io.emit('usersMap', usersMap.toArray());
    }
    console.log('soket-service, disconnect: ')
    console.log(obj.socketId)
    console.log()

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
            console.log( data["token"])
            console.log(gameService.isPlayerWasInGame(obj.data.username))
        }
        if (data["token"] === "newUser") {
            data["avatarImg"] = constants.Avatars.get(obj.data.username)

            gameService.addPlayer(io, obj.data.socketId, obj.data.username);
            data["color"] = constants.Colors[gameService.players().get(obj.data.socketId).no];
            data["no"] = gameService.players().get(obj.data.socketId).no

        }
    }
    usersMap = usersMap.set(obj.data.socketId, data);
    io.emit('usersMap', usersMap.toArray());
    console.log('soket-service, connect: ')
    console.log('username: '+data.username+', socketId: '+data.socketId+', token: '+data.token+', avatarImg: '+data.avatarImg+', color: '+data.color+', no: '+data.no)
    console.log()
}