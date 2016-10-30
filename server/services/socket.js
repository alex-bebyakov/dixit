const users=require('../models/user');
const Rx = require('rxjs');
module.exports=function (io,usersMap) {
    const sourceConnect = Rx.Observable.create(function (observer) {
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

    const sourceDisconnect = Rx.Observable.create(function (observer) {
        io.on('connection', function (socket) {
            socket.on('disconnect', function (data) {
                observer.next({'socketId': socket.id, 'event': 'client disconnect'});
            });
        });
        return function () {
            io.close();
        }
    });

    const observerConnect = sourceConnect.subscribe(function (obj) {
        var data = obj.data;
        data["token"] = "newUser";
        usersMap.toArray().forEach(function (element) {
            if (element.username === obj.data.username) {
                data["token"] = "userExist";
            }
        })
        data["avatarImg"] = users.Avatars.get(obj.data.username)
        console.log(data);
        usersMap = usersMap.set(obj.data.socketId, data);
        console.log(data);
        io.emit('usersMap', usersMap.toArray());
    });

    const observerDisconnect = sourceDisconnect.subscribe(function (obj) {
        var socketId = obj.socketId;
        var user = usersMap.get(socketId);
        usersMap = usersMap.delete(obj.socketId);
        io.emit('usersMap', usersMap.toArray());
    });
}


