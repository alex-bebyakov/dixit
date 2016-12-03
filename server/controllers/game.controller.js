var gameService = require('../services/game.service');
var messageService = require('../services/message.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;

    if (gameService.players().get(data.userId).name === data.user.username) {
        gameService.update(data)
        var players = gameService.players()
        var oldPhase=gameService.getOldPhase()
        messageService.send(io, players, gameService.game(),data, players.get(data.userId),oldPhase)
        res.status(200).send();
    } else {

    }

}

