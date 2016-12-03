var Immutable = require('immutable')
var utils = require('../utils')

var Player = require('../models/player')
var Card = require('../models/card')
var Game = require('../models/game')
var Selection = require('../models/selection')
const MAX_SCORE = 30
const DECK_AMOUNT = 84
const CLOSE_CARD_IMG = 'assets/images/cards/card_.png'
var playerNo = 0;
var game = new Game('starting', 'asking', '', []);
var players = Immutable.Map({});
var deck = [];
var players_list = [];
var cards_list = Immutable.Map({});
var oldPhase = 'asking';
var closeCard = new Card(CLOSE_CARD_IMG, false)
var finishCommands = 0
var lastAskPlayerNo = 0
var isScoresMustUpdate = false
var tempSelections=[]

var gameTick = function (data) {
    var player = players.get(data.userId)
    players = players.delete(data.userId)
    oldPhase = game.phase
    player.handActive = false;
    if (player.name === data.user.username) {
        if (data.command === 'SendCard') {
            for (var i = 0; i < 6; i++) {
                if (data.card.img === player.cards[i].img) {
                    player.cards.splice(i, 1)
                    player.cards.push(utils.dealCardsForPlayer(deck, 1)[0]);
                    cards_list = cards_list.set(data.userId, data.card)
                    game.cards.push(closeCard)
                    if ('asking' === game.phase) {
                        game.phase = 'answering'
                        lastAskPlayerNo = player.no
                        players.forEach(function (value, key) {
                            value.handActive = true
                        })
                    } else if (game.phase === 'answering') {
                        if (players.size === cards_list.size - 1) {
                            game.phase = 'selecting'
                            oldPhase = 'selecting'
                            game.cards = []
                            for (var j = 0; j < cards_list.size; j++) {
                                game.cards.push(new Card('', false))
                            }
                            cards_list.forEach(function (value, key) {
                                game.cards = utils.addCard(value, game.cards)
                            })
                            players.forEach(function (value, key) {
                                if (value.no !== lastAskPlayerNo) {
                                    value.tableActive = true
                                }
                            })
                            player.tableActive = true
                        }
                    }
                }
            }
            players = players.set(data.userId, player)
        } else if (data.command === 'SelectCard') {
            for (var j = 0; j < game.cards.length; j++) {
                if (data.card.img === game.cards[j].img) {
                    var selection=new Selection()
                    selection.img=utils.generateNumberImg(player.no, j)
                    tempSelections.push(selection)
                    var closeSelection=new Selection()
                    closeSelection.img=utils.generateNumberImg(player.no, -1)
                    game.selections.push(closeSelection)
                    player.selectNum = j + 1
                    player.tableActive = false
                }
            }
            var activeTables = 0
            players.forEach(function (value, key) {
                if (value.tableActive) {
                    activeTables++;
                }
            })
            if (0 === activeTables) {
                isScoresMustUpdate = true
                game.phase = 'finishing'
                oldPhase = 'finishing'
            }
            players = players.set(data.userId, player)
            if (isScoresMustUpdate) {
                isScoresMustUpdate = false
                game.selections=tempSelections
                tempSelections=[]
                updateScores()
            }
        }
        if (data.command === 'FinishRound') {
            players = players.set(data.userId, player)
            if(finishCommands===0){
                //game.cards = []
            }

            finishCommands++;
            if (finishCommands === players.size) {
                game.phase = 'asking'
                oldPhase = 'asking'
                resetRound()
            }
        }
    }
}

var fillDeck = function () {
    var deck = [DECK_AMOUNT];
    for (var i = 0; i < DECK_AMOUNT; i++) {
        deck.push(new Card('', false))
    }
    for (var i = 0; i < DECK_AMOUNT; i++) {
        var card = new Card('', false);
        card.img = utils.generateCardImg(i);
        deck = utils.addCard(card, deck);
    }
    return deck;
};

var resetRound = function () {
    lastAskPlayerNo++;
    if (lastAskPlayerNo > players.size) {
        lastAskPlayerNo = 0;
    }
    finishCommands = 0
    game.cards = []
    game.selections=[]
    cards_list = Immutable.Map({});
    players.forEach(function (value, key) {
        value.selectImg = ''
        value.selectNum = 0
        if (value.no === lastAskPlayerNo) {
            value.handActive = true
        }
    })
}

var updateScores = function () {
    var numOfRightAnswers = 0
    var scores = Immutable.Map({});
    players.forEach(function (value, key) {
        scores = scores.set(key, 0)
    })
    players.forEach(function (value, key) {
        if (value.selectNum > 0) {
            if (game.cards[value.selectNum - 1].asking) {
                numOfRightAnswers++;
                scores = scores.set(key, 3)
            } else {
                cards_list.forEach(function (value1, key1) {
                    if (game.cards[value.selectNum - 1].img === value1.img) {
                        var tempScore = scores.get(key1) + 1
                        scores = scores.set(key1, tempScore)
                    }
                })
            }
        } else {
            scores = scores.set(key, 3)
        }
    })

    if (numOfRightAnswers === 0 || numOfRightAnswers === players.size - 1) {
        players.forEach(function (value, key) {
            if (value.selectNum !== 0) {
                value.score += 2
                cards_list.forEach(function (value1, key1) {
                    if (game.cards[value.selectNum - 1].img === value1.img) {
                        players.get(key1).score++
                    }
                })
            }
        })
    } else {
        players.forEach(function (value, key) {
            value.score += scores.get(key)
        })
    }

}

var returnCardsToDeck = function (cards) {
    for (var i = 0; i < cards.length; i++) {
        deck.push(cards[i]);
    }
}

var startGame = function () {
    if (players.size > 2) {
        if (!game.started) {
            game.started = true;
            game.cards = []
            deck = fillDeck();

            game.id = utils.createRandomId(7)
            utils.dealCards(deck, players, 6);
            players.forEach(function (value, key) {
                players_list.push(value.name);
                if (value.active) {
                    value.handActive = true;
                    value.active = false;
                }
            })

        }
    }
};

var updateGameStatus = function () {
    if (game.status === 'starting') {
        if (game.started) {
            game.status = 'playing';
        }
    } else if (game.status === 'playing') {
        players.forEach(function (value, key) {
            if (value.score >= MAX_SCORE) {
                game.status = 'over'
            }
        })
    }
}

var newGame = function () {
    game.status = 'starting';
    game.id = '';
    game.phase = 'asking';
    game.started = false
    players.forEach(function (value, key) {
        value.score = 0;
        value.cards = []
    })
    players_list = [];
    game.cards = []
    game.selections=[]
    cards_list = Immutable.Map({});
};

module.exports = {
    addPlayer: function (io, id, name) {
        var player = new Player({});
        player.name = name;
        player.no = playerNo;
        player.score = 0;
        player.cards = []
        player.handActive = false;
        player.tableActive = false;
        player.selectImg = ''
        player.selectNum = 0
        if (0 === playerNo) {
            player.active = true;
        } else {
            player.active = false;
        }
        for (var i = 0; i < players_list.length; i++) {
            if (name === players_list[i] && game.status === 'playing') {
                player.cards = utils.dealCardsForPlayer(deck, 6);
            }
        }
        players = players.set(id, player)
        playerNo++;
    },
    removePlayer: function (io, id) {
        var player = players.get(id)
        var removedPlayerNumber = player.no;
        var isRemovedPlayerActive = player.active;
        returnCardsToDeck(player.cards);
        players = players.delete(id);
        playerNo--;
        players.forEach(function (value, key) {
            if (value.no > removedPlayerNumber) {
                value.no = value.no - 1
            }
            if (isRemovedPlayerActive) {
                value.active = true
                isRemovedPlayerActive = false
            }
            players = players.set(key, value)

        })
    },
    update: function (data) {
        if (game.status === 'playing') {
            if (players.size > 2) {
                gameTick(data);
            }
        } else if (game.status === 'over') {
            newGame();
        } else if (game.status === 'starting' && 'Start' === data.command) {
            startGame();
        }
        updateGameStatus();
    },
    getOldPhase: function () {
        return oldPhase
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