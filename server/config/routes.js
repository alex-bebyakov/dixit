const chat = require('../controllers/chat');
const auth = require('../controllers/auth');

module.exports = function (app,io) {
    app.post('/api/chat',function (req,res) {
        chat.sendMsg(io,req,res);
    });
    app.post('/api/authenticate', auth.login);
}
