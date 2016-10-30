var gameStart = false;
utils = require('../utils')
exports.start = function (req, res) {
    if (req.body.master === 'start' && gameStart === false) {
        gameStart = true;
        res.status(200).send();

    }
}

