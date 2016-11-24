var gameService = require('../services/game.service');
var messageService = require('../services/message.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;
    var players = gameService.players()
    var player = players.get(data.userId)
    if (player.name === data.user.username) {
        gameService.update(data)
        messageService.send(io, players, gameService.game(), data, player)
        res.status(200).send();
    } else {

    }

}

