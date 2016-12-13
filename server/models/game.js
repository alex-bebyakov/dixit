var Card = require('../models/card')
var Selection = require('../models/selection')
var Game = function (status, phase, id, cards) {
    this.status = status;
    this.id = id;
    this.started = false
    this.phase = phase
    this.cards = cards
    this.selections = []
    this.scores = []
    this.roundScores = []
    this.playersNames = []
}

Game.prototype.status = ''
Game.prototype.phase = ''
Game.prototype.id = ''
Game.prototype.started = false
Game.prototype.cards = Card[6]
Game.prototype.selections = Selection[6]
Game.prototype.scores = [6]
Game.prototype.roundScores = [6]
Game.prototype.playersNames = [6]
module.exports = Game;