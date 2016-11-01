var game = require('../services/game.service');

exports.sendMsg = function (io, req, res) {
    var data = req.body;
    game.update(data);
    res.status(200).send();
    io.emit('gameMessage', game.data());
}