utils = require('../utils')
exports.sendMsg = function (io, req, res) {
    var data = req.body;
    data["sentAt"] = utils.getTimeMark();
    res.status(200).send();
    io.emit('chatMessage', data);
}


