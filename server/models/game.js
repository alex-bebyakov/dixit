var Card = require('../models/card')
var Selection = require('../models/selection')
var Game = function (status, phase,id,cards) {
    this.status = status;
    this.id = id;
    this.started = false
    this.phase=phase
    this.cards=cards
    this.selections=[]
}

Game.prototype.status = ''
Game.prototype.phase = ''
Game.prototype.id = ''
Game.prototype.started = false
Game.prototype.cards = Card[6]
Game.prototype.selections = Selection[6]
module.exports = Game;