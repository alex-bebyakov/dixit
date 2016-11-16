var Card = require('../models/card')
var Player = function () {

}

Player.prototype.name = ''
Player.prototype.active = false
Player.prototype.no = -1
Player.prototype.score = -1
Player.prototype.cards = Card[6]

module.exports = Player;