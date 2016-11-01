var game = require('../models/game')
var playerNo = 0;
var player = require('../models/player')
utils = require('../utils')

module.exports = {
    create: function () {
        game.status = 'over';
        game.ini = false;
        game.players = require('immutable').Map({});
        game.id = '';
    },
    addPlayer: function (name, avatar) {
        if (game.players.size < 7) {
            player.avatar = avatar;
            player.no = playerNo;
            player.score = 0;
            game.players = game.players.set(name, player);
            playerNo++;
        }
    },

    removePlayer: function (name) {
    },

    update: function (data, io) {
        if (game.players.size > 2) {
            if (!game.ini) {
                game.ini = true;
                game.id = 'aaa-1';
                game.status = 'playing';
            } else {
                if (game.status = 'paused') {
                    game.status = 'playing'
                }
            }
        } else {
            if (game.ini) {
                if (game.status !== 'paused') {
                    game.status = 'paused';
                }
            }
        }
        if (game.status === 'playing') {
            //game=utils.gameTick(data);
        }
        io.emit('gameMessage', game);
        console.log(game);
    },


    status: function () {
        return game.status;
    },

    setStatus: function (status) {
        game.status = status;
    },

    id: function () {
        return game.id;
    },

    started: function () {
        return game.ini;
    }
}