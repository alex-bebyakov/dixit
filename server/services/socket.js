const users=require('../models/user');
const Rx = require('rxjs');
var usersMap = require('immutable').Map({});

module.exports = function (io) {
    const playerConnect = Rx.Observable.create(function (observer) {
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

    playerConnect.subscribe(function (obj) {

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
            data["avatarImg"] = users.Avatars.get(obj.data.username)
        }
        usersMap = usersMap.set(obj.data.socketId, data);
        io.emit('usersMap', usersMap.toArray());
        console.log(data);
    });

    const playerDisconnect = Rx.Observable.create(function (observer) {
        io.on('connection', function (socket) {
            socket.on('disconnect', function (data) {
                observer.next({'socketId': socket.id, 'event': 'client disconnect'});
            });
        });
        return function () {
            io.close();
        }
    });

    playerDisconnect.subscribe(function (obj) {
        var socketId = obj.socketId;
        var user = usersMap.get(socketId);
        usersMap = usersMap.delete(obj.socketId);
        io.emit('usersMap', usersMap.toArray());
    });

    const gameStart = Rx.Observable.create(function (observer) {
        return function () {
            io.close();
        }
    });
}


