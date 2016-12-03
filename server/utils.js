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

    generateNumberImg: function (playerNo,cardNo) {
       if(cardNo===-1){
            return 'assets/images/numbers/num_'
                .concat(playerNo.toString())
                .concat('_')
                .concat('.png')
        }else{
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

    dealCardsForPlayer: function (deck,num) {
        var index = deck.length - 1;
        var cards = []
        for (var i = 0; i < num; i++) {
            cards.push(deck[index]);
            deck.splice(index, 1);
            index--;
        }
        return cards;
    }
}




