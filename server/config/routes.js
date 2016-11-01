const chat = require('../controllers/chat.controller');
const auth = require('../controllers/auth.controller');
const game = require('../controllers/game.controller');
module.exports = function (app,io) {
    app.post('/api/chat',function (req,res) {
        chat.sendMsg(io,req,res);
    });
    app.post('/api/authenticate', auth.login);

    //app.get('/api/game/status', game.status);
    //  app.get('/api/game/id', game.id);

    app.post('/api/game', function (req, res) {
        game.sendMsg(io, req, res);
    });
}
