var gameService = require('../services/game.service');
var messageService = require('../services/message.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;
    console.log('game-controller: ')
    console.log('_username: '+data._username+', _command: '+data._command+', _userId: '+data._userId+', _text: '+data._text+', _card: '+data._card)
    console.log()
    if (gameService.players().get(data._userId).name === data._username) {
        if (isUpdate(data)) {
            gameService.update(data)
        }
        messageService.send(io, data, gameService.players(), gameService.game(), gameService.oldPhase())
        res.status(200).send();
    }
}

var isUpdate = function (data) {
    var result = true;
    if (data._command === 'Enter') {
        return false;
    } else if (data._command === 'SendCard' && data._text === '') {
        return false;
    }
    return result
}

