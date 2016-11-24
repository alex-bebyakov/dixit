var gameService = require('../services/game.service');
var text = "";
var command = "";
var type = -1;
var socketEmit = function (io, player, game) {
    io.emit('gameMessage_'.concat(player.name.toString()), {
        'game': game,
        'player': player,
        'text': text
    });

}

var update = function (data, status, username, size) {
    command = data.command
    if (size > 2) {
        if (command === 'Start') {
            if (status === 'starting') {
                type = 0
                text = "Для начала игры необходимо не менее 3-х игроков!"
            } else if (status === 'playing') {
                type = 1
                text = "Игра началась! Ходит игрок " + username + "!"
            }
        } else if (command === 'Enter') {
            type = 1
            text = "Enter"
        }
    } else {
        if (command === 'Enter') {
            type = 1
            text = 'Enter'
        } else {
            if (status === 'starting') {
                type = 0
                text = "Для начала игры необходимо не менее 3-х игроков!"
            } else if (status === 'playing') {
                type = 1
                text = "Игра остановлена, так как в игре находится менее трех игроков!"
            }
        }


    }

}

module.exports = {
    send: function (io, players, game, data, player) {
        update(data, game.status, player.name, players.size)
        if (0 === type) {
            socketEmit(io, player, game)
        } else {
            if (1 === type) {
                players.forEach(function (value, key) {
                    socketEmit(io, value, game)
                })
            } else if (2 === type) {
                players.forEach(function (value, key) {
                    if (value.name !== player.name) {
                        socketEmit(io, value, game)
                    }
                })
            }
        }
    }
}