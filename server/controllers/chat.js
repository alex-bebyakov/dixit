exports.sendMsg=function (io,req, res) {
    var data = req.body;
    data["sentAt"] = getTimeMark();
    res.status(200).send();
    io.emit('chatMessage', data);
}

function getTimeMark() {
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
}
