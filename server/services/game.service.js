var Immutable = require('immutable')
var utils = require('../utils')
var Player = require('../models/player')
var Card = require('../models/card')
var Game = require('../models/game')

const MAX_SCORE = 30
const DECK_AMOUNT = 84
var playerNo = 0;
var game = new Game('starting', '');
var players = Immutable.Map({});
var deck = [];
var players_list = [];

var gameTick = function (data) {

};

var fillDeck = function () {
    var deck = [DECK_AMOUNT];
    for (var i = 0; i < DECK_AMOUNT; i++) {
        deck.push(new Card())
    }
    for (var i = 0; i < DECK_AMOUNT; i++) {
        var card = new Card();
        card.img = utils.generateCardImg(i);
        deck = utils.addCard(card, deck);
    }
    return deck;
};

var returnCardsToDeck = function (cards) {
    for (var i = 0; i < cards.length; i++) {
        deck.push(cards[i]);
    }
}

var startGame = function () {
    if (players.size > 2) {
        if (!game.started) {
            game.started = true;
            deck = fillDeck();
            game.id = utils.createRandomGameId(7);
            utils.dealCards(deck, players, 6);
            players.forEach(function (value, key) {
                players_list.push(value.name);
            })

        }
    }
};

var updateStatus = function () {
    if (game.status === 'starting') {
        if (game.started) {
            game.status = 'playing';
        } else {
            if (players.size < 1) {
                game.status = 'over';
            }
        }
    } else if (game.status === 'playing') {
        if (players.size < 3) {
            game.status = 'paused';
        }
        players.forEach(function (value, key) {
            if (value.score >= MAX_SCORE) {
                game.status = 'over'
            }
        })
    } else if (game.status === 'paused') {
        if (players.size > 2) {
            game.status = 'playing';
        }
        if (players.size < 1) {
            game.status = 'over';
        }
    }
    console.log(game.status);

}

var newGame = function () {
    game.status = 'starting';
    game.id = '';
    game.phase = '';
    game.started = false
    players.forEach(function (value, key) {
        value.score = 0;
    })
    players_list = [];
};

module.exports = {
    addPlayer: function (name) {
        var player = new Player({});
        player.name = name;
        player.no = playerNo;
        player.score = 0;
        player.cards = []
        for (var i = 0; i < players_list.length; i++) {
            if (name === players_list[i]) {
                player.cards = utils.dealCardsForPlayer(deck);
            }
        }
        if (playerNo === 0) {
            player.active = true;
        } else {
            player.active = false;
        }
        var key = "player_" + playerNo.toString();
        players = players.set(key, player)
        playerNo++;
    },
    removePlayer: function (name) {
        var newActive = false;
        players.forEach(function (value, key) {
            if (value.name === name) {
                newActive = value.active;
                returnCardsToDeck(value.cards);
                players = players.delete(key);
            }
        })
        players.forEach(function (value, key) {
            if (newActive) {
                value.active = true;
                newActive = false;
            }
        })
        playerNo--;
        updateStatus();
    },
    update: function (data) {
        if (game.status === 'playing') {
            gameTick(data);
        } else if (game.status === 'over') {
            newGame();
        } else if (game.status === 'starting' && data.text === 'start') {
            startGame();
        }
        updateStatus();
    },
    reset: function () {
        newGame();
    },
    started: function () {
        return game.started;
    },
    game: function () {
        return game;
    },
    players: function () {
        return players;
    },
    isPlayerWasInGame: function (name) {
        for (var i = 0; i < players_list.length; i++) {
            if (name === players_list[i]) {
                return true;
            }
        }
        return false;
    }
}