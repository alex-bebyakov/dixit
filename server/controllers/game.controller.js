var game = require('../services/game.service');

/*exports={
 status: function (io, req, res) {
 res.status(200).send();
 io.emit('game', game.status);
 },
 id: function (io, req, res) {
 res.status(200).send();
 io.emit('game', game.id);
 },
 sendMsg: function (io, req, res) {
 var data = req.body;
 game.update(data,io);
 res.status(200).send();
 }
 }*/

exports.sendMsg = function (io, req, res) {
    var data = req.body;
    game.update(data, io);
    res.status(200).send();
}