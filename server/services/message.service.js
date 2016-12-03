var gameService = require('../services/game.service');
var text = "";
var command = "";
var type = -1;
var assosiation=""
var socketEmit = function (io, player, game) {
    io.emit('gameMessage_'.concat(player.name.toString()), {
        'game': game,
        'player': player,
        'text': text
    });

}

var update = function (data, status, phase,username, playersSize,selectNum) {
    command = data.command
    text='empty_response'
    if (playersSize > 2) {
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
        }else if (command === 'SendCard') {

            if('asking'===phase){
                type = 1
                text = "Игрок "+ username + ' предлагает ассоциацию : '+data.text
                assosiation=data.text
              }else if('answering'===phase){
                type = 1
                text = "Игрок "+ username +" сделал ход! Ждем других игроков!"
            }else if('selecting'===phase){
                type = 1
                text = "Выберите карту для ассоциации "+assosiation
            }

        }else if(command === 'SelectCard'){
            type = 1
            if('finishing'===phase){
                text = 'Выбор карт завершен. Нажмите для продолжения.'
            }else{
                text = "Игрок "+ username + ' выбрал карту'
            }

        }else if(command === 'FinishRound'){
            if('asking'===phase){
                type = 1
                text = "Ходит игрок " + username + "!"
            }else{
                type = 1
                text = 'Игрок ' + username + ' завершил раунд!'
            }
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
    send: function (io, players, game, data, player,oldPhase) {
        var username=player.name
        if('asking'===oldPhase&&data.command === 'FinishRound'){
            players.forEach(function (value, key) {
                if(value.handActive){
                    username=value.name
                }
            })
        }
        update(data, game.status,oldPhase, username, players.size,player.selectNum)
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