var utils = require('../utils')

var Card = function (img, asking) {
    this.img = img
    this.asking = asking
    this.playerN = -1
    this.color = utils.setColor(this.playerN)
}

Card.prototype.img = ''
Card.prototype.asking = false
Card.prototype.playerN = 0
Card.prototype.color = 'transparent'
module.exports = Card;