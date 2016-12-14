var utils = require('../utils');
var gameService = require('../services/game.service');
var chatText = '';
var masterText = '';
var assosiation = ''
var isChatMsg = false
var masterMsgType = -1
var playerMsgType = -1
var tableMsgType = -1

var socketEmit = function (io, player, game, streamName) {
    io.emit(streamName.concat(player.name.toString()), {
        'game': game,
        'player': player
    });
}

var sendGameMsg = function (io, players, game, type, isPlayerMsg, userId) {
    if (0 === type) {
        var player = players.get(userId)
        if (isPlayerMsg) {
            socketEmit(io, player, game, 'playerMessage_')
        } else {
            socketEmit(io, player, game, 'tableMessage_')
        }
    }
    else {
        if (1 === type) {
            players.forEach(function (value, key) {
                if (isPlayerMsg) {
                    socketEmit(io, value, game, 'playerMessage_')
                } else {
                    socketEmit(io, value, game, 'tableMessage_')
                }
            })
        }
        else if (2 === type) {
            var player = players.get(userId)
            players.forEach(function (value, key) {
                if (value.name !== player.name) {
                    if (isPlayerMsg) {
                        socketEmit(io, value, game, 'playerMessage_')
                    } else {
                        socketEmit(io, value, game, 'tableMessage_')
                    }
                }
            })
        }
    }
}

var sendChatMsg = function (io) {
    io.emit('chatMessage', {
        'username': 'Master',
        'img': 'assets/images/game-master-chat.png',
        'text': chatText,
        'sentAt': utils.getTimeMark()
    });
}

var sendMasterMsg = function (io, players, type, userId) {
    if (0 === type) {
        var player = players.get(userId)
        io.emit('masterMessage_'.concat(players.get(userId).name.toString()), {
            'text': masterText
        });
    }
    else {
        if (1 === type) {
            players.forEach(function (value, key) {
                io.emit('masterMessage_'.concat(value.name.toString()), {
                    'text': masterText
                });
            })
        }
        else if (2 === type) {
            var player = players.get(userId)
            players.forEach(function (value, key) {
                if (value.name !== player.name) {
                    io.emit('masterMessage_'.concat(value.name.toString()), {
                        'text': masterText
                    });
                }
            })
        }
    }
}

var sendMsg = function (io, players, game, userId) {
    if (isChatMsg) {
        sendChatMsg(io)
    }
    sendMasterMsg(io, players, masterMsgType, userId)
    sendGameMsg(io, players, game, playerMsgType, true, userId)
    sendGameMsg(io, players, game, tableMsgType, false, userId)

}

var greetings = function (username) {
    masterMsgType = 0
    playerMsgType = 0
    masterText = 'Добро пожаловать, ' + username + '!'
}

var start = function (status, username) {

    if (status === 'playing') {
        masterText = 'Игра началась, ходит игрок ' + username + '.'
        playerMsgType = 1
        masterMsgType = 1
    } else if (status === 'starting') {
        masterText = 'Для начала игры необходимо не менее трех игроков!'
        playerMsgType = 0
        masterMsgType = 0
    }
}

var sendCard = function (phase, msg, username) {
    if (msg === '') {
        masterMsgType = 0
        text = 'Введите ассоциацию!'
    }
    else if (phase === 'asking') {
        masterMsgType = 1
        playerMsgType = 1
        tableMsgType = 1
        assosiation = msg
        masterText = 'Игрок ' + username + ' загадал карту: "' + assosiation + ' "'
    } else {
        if (phase === 'selecting') {
            playerMsgType = 1

        } else {
            playerMsgType = 0
        }
        tableMsgType = 1
    }
}

var selectCard = function () {
    playerMsgType = 1
    tableMsgType = 1
}

var finishRound = function (phase, players, username, userId, isGameOver) {
    playerMsgType = 1
    tableMsgType = 1
    isChatMsg = true
    if (isGameOver) {
        chatText = 'Игрок ' + username + ' завершил игру ';// + utils.getPosition(gameService.positions().get(userId))
    } else {

        chatText = 'Игрок ' + username + ' завершил раунд ';// + utils.getPosition(gameService.positions().get(userId))
    }

    if (phase === 'asking') {

        if (isGameOver) {
            var name = ''
            players.forEach(function (value, key) {
                if (value.active === true) {
                    name = value.name
                }
            })
            masterText = 'Игра завершена. Победил игрок ' + name + '!'
        } else {
            var name = ''
            players.forEach(function (value, key) {
                if (value.status === "asker") {
                    name = value.name
                }
            })
            masterText = 'Раунд завершен. Ходит игрок ' + name + '!'
        }

        masterMsgType = 1
    }
}

var update = function (data, players, game, oldPhase) {
    text = 'empty_response'
    isChatMsg = false
    masterMsgType = -1
    playerMsgType = -1
    tableMsgType = -1
    switch (data._command) {
        case 'Enter':
            greetings(players.get(data._userId).name)
            break;
        case 'Start':
            start(game.status, players.get(data._userId).name)
            break;
        case 'SendCard':
            sendCard(oldPhase, data._text, players.get(data._userId).name)
            break;
        case 'SelectCard':
            selectCard()
            break;
        case 'FinishRound':
            if (game.status === 'playing') {
                finishRound(oldPhase, players, players.get(data._userId).name, data._userId, false)
            }
            else {
                finishRound(oldPhase, players, players.get(data._userId).name, data._userId, true)
            }

            break;
        case 'ReEnter':
            playerMsgType = 0
            tableMsgType = 0
            break;
        case 'Remove':
            playerMsgType = 1
            tableMsgType = 1
            break;
        default:
    }
}

module.exports = {
    send: function (io, data, players, game, oldPhase) {
        update(data, players, game, oldPhase)
        sendMsg(io, players, game, data._userId)
    }
}