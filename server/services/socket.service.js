const constants = require('../config/constants');
var game = require('../services/game.service');
const Rx = require('rxjs');
var usersMap = require('immutable').Map({});

module.exports = function (io) {
    game.create();
    const connectionThread = Rx.Observable.create(function (observer) {
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
    const disconnectionThread = Rx.Observable.create(function (observer) {
        io.on('connection', function (socket) {
            socket.on('disconnect', function (data) {
                observer.next({'socketId': socket.id, 'event': 'client disconnect'});
            });
        });
        return function () {
            io.close();
        }
    });
    connectionThread.subscribe(function (obj) {
        var data = obj.data;
        data["token"] = "newUser";
        if (usersMap.size > 5) {
            data["token"] = "toManyUsers";
        } else {
            usersMap.toArray().forEach(function (element) {
                if (element.username === obj.data.username) {
                    data["token"] = "userExist";
                }
            })
        }
        if (data["token"] === "newUser") {
            data["avatarImg"] = constants.Avatars.get(obj.data.username)
            game.addPlayer(obj.data.username, constants.Avatars.get(obj.data.username));
        }
        usersMap = usersMap.set(obj.data.socketId, data);
        io.emit('usersMap', usersMap.toArray());
    });
    disconnectionThread.subscribe(function (obj) {
        game.removePlayer(usersMap.get(obj.socketId).username);
        usersMap = usersMap.delete(obj.socketId);
        io.emit('usersMap', usersMap.toArray());

    });

}


