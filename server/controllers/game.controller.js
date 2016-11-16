var gameService = require('../services/game.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;
    gameService.update(data);
    res.status(200).send();
    gameService.players().forEach(function (value, key) {
        io.emit('gameMessage_'.concat(value.name.toString()), {
            'game': gameService.game(),
            'player': value,
            'msg': data
        });
    })

}