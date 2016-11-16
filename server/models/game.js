var Immutable = require('immutable')
var Game = function (status, id) {
    this.status = status;
    this.id = id;
    this.started = false
}

Game.prototype.status = ''
Game.prototype.id = ''
Game.prototype.started = false
module.exports = Game;