var gameService = require('../services/game.service');
var messageService = require('../services/message.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;

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

