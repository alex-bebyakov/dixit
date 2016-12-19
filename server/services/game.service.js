var Immutable = require('immutable')
var utils = require('../utils')
var messageService = require('../services/message.service');
var Player = require('../models/player')
var Card = require('../models/card')
var Game = require('../models/game')
var Selection = require('../models/selection')
const MAX_SCORE = 30
const DECK_AMOUNT = 167
const CLOSE_CARD_IMG = 'assets/images/cards/card_.png'
var playerNo = 0;
var game = new Game('starting', 'asking', '', []);
var players = Immutable.Map({});
var waitingPlayers= Immutable.Map({});
var deck = [];
var cards_list = Immutable.Map({});
var positions = Immutable.Map({});
var oldPhase = '';
var closeCard = new Card(CLOSE_CARD_IMG, false)
var finishCommands = 0
var lastAskPlayerNo = 0
var isScoresMustUpdate = false
var tempSelections = []
var tempDeck = []

var gameTick = function (data) {
    var player = players.get(data._userId)
    players = players.delete(data._userId)
    if (deck.length === 0) {
        deck = tempDeck
        tempDeck = []
    }
    oldPhase = game.phase
    if (player.name === data._username) {
        if (data._command === 'SendCard') {
            for (var i = 0; i < 6; i++) {
                if (data._card.img === player.cards[i].img) {
                    var tempDeckCard = new Card('', false)
                    tempDeckCard.img = data._card.img
                    tempDeck.push(tempDeckCard)
                    player.cards.splice(i, 1)
                    player.cards.push(utils.dealCardsForPlayer(deck, 1)[0]);
                    var tempListCard = new Card('', false)
                    tempListCard = data._card
                    tempListCard.playerN = player.no
                    tempListCard.color = utils.setColor(player.no)
                    cards_list = cards_list.set(data._userId, tempListCard)
                    game.cards.push(closeCard)
                    if ('asking' === game.phase) {
                        game.phase = 'answering'
                        lastAskPlayerNo = player.no
                        player.handActive = false;
                    } else if (game.phase === 'answering') {
                        player.handActive = false;

                        if (players.size + 1 === cards_list.size) {
                            game.phase = 'selecting'
                            oldPhase = game.phase
                            game.cards = []
                            for (var j = 0; j < cards_list.size; j++) {
                                game.cards.push(new Card('', false))
                            }
                            cards_list.forEach(function (value, key) {
                                var tempCard = new Card('', false)
                                tempCard.img = value.img;
                                game.cards = utils.addCard(tempCard, game.cards)
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
            players = players.set(data._userId, player)
        }
        else if (data._command === 'SelectCard') {
            for (var j = 0; j < game.cards.length; j++) {
                if (data._card.img === game.cards[j].img) {
                    var selection = new Selection()
                    selection.img = utils.generateNumberImg(player.no, j)
                    selection.no = j
                    tempSelections.push(selection)
                    var closeSelection = new Selection()
                    closeSelection.img = utils.generateNumberImg(player.no, -1)
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
            }
            players = players.set(data._userId, player)
            if (isScoresMustUpdate) {
                isScoresMustUpdate = false
                game.selections = tempSelections
                tempSelections = []
                cards_list.forEach(function (value, key) {
                    if (value.asking) {
                        for (var j = 0; j < game.cards.length; j++) {
                            if (game.cards[j].img == value.img) {
                                game.cards[j].asking = true
                            }
                        }
                    }
                    for (var j = 0; j < game.cards.length; j++) {
                        if (game.cards[j].img == value.img) {
                            game.cards[j].playerN = value.playerN
                            game.cards[j].color = value.color
                        }
                    }
                });
                updateScores()
            }
        }
        if (data._command === 'FinishRound') {
            players = players.set(data._userId, player)
            finishCommands++;
            if (finishCommands === players.size) {
                if (game.status === 'over') {
                    resetRound(true)
                } else {
                    resetRound(false)
                }
            }
        }
    }
}

var fillDeck = function (amount) {
    var deck = [];
    for (var i = 0; i < amount; i++) {
        deck.push(new Card('', false))
    }
    for (var i = 0; i < amount; i++) {
        var card = new Card('', false);
        card.img = utils.generateCardImg(i);
        deck = utils.addCard(card, deck);
    }
    return deck;
};

var resetRound = function (isGameOver) {
    finishCommands = 0
    if(!waitingPlayers.isEmpty()){
        waitingPlayers.forEach(function (value, key) {
            players=players.set(key,value)
            game.playersNames[value.no]=value.name
        })
        waitingPlayers.clear()
    }

    if (isGameOver) {
        newGame()
    } else {
        lastAskPlayerNo++;
        if (lastAskPlayerNo > players.size - 1) {
            lastAskPlayerNo = 0;
        }
        game.cards = []
        game.selections = []
        game.roundScores = []
        game.phase = 'asking'
        oldPhase = 'asking'
        cards_list = Immutable.Map({});
        players.forEach(function (value, key) {
            value.selectNum = 0
            value.handActive = true
            if (value.no === lastAskPlayerNo) {
                value.status = "asker"
            } else {
                value.status = "answer"
            }
        })
    }
}

var updateScores = function () {
    var numOfRightAnswers = 0
    var scores = Immutable.Map({});
    var askingPlayerKey
    players.forEach(function (value, key) {
        scores = scores.set(key, 0)
    })
    players.forEach(function (value, key) {
        if (value.selectNum > 0) {
            if (game.cards[value.selectNum - 1].asking) {
                numOfRightAnswers++;
                scores = scores.set(key, 3)

            }

                cards_list.forEach(function (value1, key1) {
                    if (game.cards[value.selectNum - 1].img === value1.img) {
                        if (players.get(key1).selectNum !== 0 && players.get(key1) !== value) {
                            var tempScore = scores.get(key1) + 1
                            scores = scores.set(key1, tempScore)
                        }
                    }
                })

        } else {
            scores = scores.set(key, 3)
            askingPlayerKey = key
        }
    })

    if (numOfRightAnswers === 0 || numOfRightAnswers === players.size - 1) {
        scores = Immutable.Map({});
        players.forEach(function (value, key) {
            scores = scores.set(key, 0)
        })
        players.forEach(function (value, key) {
            if (value.selectNum !== 0) {
                value.score += 2
                var tempScore = scores.get(key) + 2
                scores = scores.set(key, tempScore)
                cards_list.forEach(function (value1, key1) {
                    if (game.cards[value.selectNum - 1].img === value1.img) {
                        if (players.get(key1).selectNum !== 0 && players.get(key1) !== value) {
                            players.get(key1).score++
                            tempScore = scores.get(key1) + 1
                            scores = scores.set(key1, tempScore)
                        }

                    }
                })
            }
        })
    }
    else {
        players.forEach(function (value, key) {
            value.score += scores.get(key)
        })
    }
    game.scores = []
    for (var i = 0; i < game.cards.length; i++) {
        players.forEach(function (value, key) {
            if (value.no == i) {
                game.roundScores.push(scores.get(key))
                game.scores.push(value.score)
            }
        })


    }

    positions = utils.getPositions(players)
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
            deck = fillDeck(DECK_AMOUNT);
            game.id = utils.createRandomId(7)
            utils.dealCards(deck, players, 6);
            players.forEach(function (value, key) {
                if (value.active) {
                    value.active = false;
                    value.status = "asker"
                } else {
                    value.status = "answer"
                }
                value.handActive = true;
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
    var max = MAX_SCORE
    var maxKey = 'empty'
    players.forEach(function (value, key) {
        if (value.score >= max) {
            if (maxKey !== 'empty') {
                players.get(maxKey).active = false;
            }
            max = value.score
            maxKey = key
            value.active = true
        }
        value.score = 0;
        value.cards = []
        value.selectNum = 0
        value.handActive = false
        value.tableActive = false
    })
    game.cards = []
    game.selections = []
    game.scores = [];
    game.roundScores = [];
    cards_list = Immutable.Map({});
};

module.exports = {
    addPlayer: function (io, id, name) {
        var player = new Player({});
        player.name = name;
        player.score = 0;
        player.selectNum = 0
        player.no = playerNo;
        if (game.status === 'playing') {
            player.cards = utils.dealCardsForPlayer(deck, 6);
            player.handActive = true;
            player.status='answer'
            player.active = false;
            waitingPlayers=waitingPlayers.set(id, player)
        }else{

            player.handActive = false;
            player.tableActive = false;
            player.cards = []
            if (0 === playerNo) {
                player.active = true;
            } else {
                player.active = false;
            }
            players = players.set(id, player)
            game.playersNames[playerNo] = name
        }
        playerNo++;
    },
    removePlayer: function (io, id) {
        if(players.get(id)){
            var player = players.get(id)
            var removedPlayerNumber = player.no;
            returnCardsToDeck(player.cards);
            players = players.delete(id);
            players.forEach(function (value, key) {
                if (value.no > removedPlayerNumber) {
                    value.no = value.no - 1
                }
                if (value.no === 0) {
                    value.active = true;
                }
                players = players.set(key, value)
            })
            game.playersNames = []
            players.forEach(function (value, key) {
                game.playersNames[value.no] = value.name
            })
            var data = []
            data["_username"] = player.name
            if(game.status==='playing'){
                data["_userId"] = id
                if(players.size<3){
                    resetRound(true)
                    data["_command"] = 'ResetGame'
                }
                else{
                    resetRound(false)
                    data["_command"] = 'ResetRound'
                }
            }
            else{
                data["_command"] = 'Exit'
            }
            messageService.send(io, data, players, game, oldPhase)
        }
        else{
            var player = waitingPlayers.get(id)
            var removedPlayerNumber = player.no;
            waitingPlayers = waitingPlayers.delete(id);
            waitingPlayers.forEach(function (value, key) {
                if (value.no > removedPlayerNumber) {
                    value.no = value.no - 1
                }
                if (value.no === 0) {
                    value.active = true;
                }
                waitingPlayers = waitingPlayers.set(key, value)
            })
        }
        playerNo--;
    },
    update: function (data) {
        if (game.status === 'starting') {
            startGame();
        } else {
            gameTick(data);
        }
        updateGameStatus();
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
    waitingPlayers: function () {
        return waitingPlayers;
    },
    positions: function () {
        return positions;
    },
    isPlayerWasInGame: function (name) {
        var result = false
        players_list.forEach(function (value, key) {
            if (name === value.name && game.status === 'playing') {
                result = true;
            }
        })
        return result;
    },
    oldPhase: function () {
        return oldPhase
    }
}