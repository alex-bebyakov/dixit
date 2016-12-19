const constants = require('./config/constants');
var Immutable = require('immutable')
module.exports = {
    getTimeMark: function () {
        var data = new Date()
        var m = data.getMinutes();
        var s = data.getSeconds();
        var min = ""
        var sec = ""
        if (m < 10) {
            min = "0" + m.toString();
        } else {
            min = m.toString();
        }
        if (s < 10) {
            sec = "0" + s.toString();
        } else {
            sec = s.toString();
        }
        return data.getHours() + ":" + min + ":" + sec;
    },

    createRandomId: function (len) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < len; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    generateCardImg: function (number) {
        return 'assets/images/cards/card_'.concat(number.toString()).concat('.png')
    },

    generateNumberImg: function (playerNo, cardNo) {
        if (cardNo === -1) {
            return 'assets/images/numbers/num_'
                .concat(playerNo.toString())
                .concat('_')
                .concat('.png')
        } else {
            return 'assets/images/numbers/num_'
                .concat(playerNo.toString())
                .concat('_')
                .concat(cardNo.toString())
                .concat('.png')
        }

    },

    addCard: function (card, deck) {

        var randomIndex = Math.floor(Math.random() * deck.length)
        var deck = deck;

        while ('' !== deck[randomIndex].img) {
            randomIndex = Math.floor(Math.random() * deck.length)
        }

        deck[randomIndex] = card;
        return deck;
    },

    dealCards: function (deck, players, repeats) {
        var index = deck.length - 1;
        for (var i = 0; i < repeats; i++) {
            players.forEach(function (value, key) {
                value.cards.push(deck[index]);
                deck.splice(index, 1);
                index--;
            })
        }

    },

    dealCardsForPlayer: function (deck, num) {
        var index = deck.length - 1;
        var cards = []
        for (var i = 0; i < num; i++) {
            cards.push(deck[index]);
            deck.splice(index, 1);
            index--;
        }
        return cards;
    },

    setHandsActive: function (players, isActive) {
        players.forEach(function (value, key) {
            value.handActive = isActive;
        })

    },
    setColor: function (no) {
        if (no < 0) {
            return 'transparent'
        }
        else {
            return constants.Colors[no]
        }
    },
    getPositions: function (players) {
        var positions = Immutable.Map({});
        players.forEach(function (value, key) {
            positions = positions.set(key, 1)
        })
        players.forEach(function (value, key) {
            var repeatScore = 0
            players.forEach(function (value1, key1) {
                if (key1 !== key && value1.score !== repeatScore) {
                    if (value.score < value1.score) {
                        positions = positions.set(key, positions.get(key) + 1)
                    }
                    repeatScore = value1.score
                }
            })
        })
        return positions
    },
    getPosition: function (pos) {
        switch (pos) {
            case 6:
                return 'на 6-ом месте.'
                break;
            case 5:
                return 'на 5-ом месте.'
                break;
            case 4:
                return 'на 4-ом месте.'
                break;
            case 3:
                return 'на 3-ем месте!'
                break;
            case 2:
                return 'на 2-ом месте!!'
                break;
            default:
                return 'лидером!!!'
        }
    },
    isAllPlayersAnswered:function(players_list_size,players_size, cards_list_size){

        console.log('players_list_size_utils: '+players_list_size)
        console.log('players_size_utils: '+players_size)
        console.log('cards_list_size_utils: '+cards_list_size)
        if(players_list_size===players_size+1){
            if(players_list_size===cards_list_size){
                return true
            }
            else{
                return false
            }
        }
        else{
            if(players_size+1===cards_list_size){
                return true
            }
            else{
                return false
            }
        }
}
}




