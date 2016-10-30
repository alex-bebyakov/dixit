const users=require('../models/user');
exports.login=function (req, res) {
    var isUserInAuthList = false;
    users.Names.forEach(function (username) {
        if (req.body.username === username) {
            isUserInAuthList = true;
        }
    })

    if (isUserInAuthList) {
        res.status(200).send({token: 'userLogIn'});
    } else {
        res.status(200).send({});
    }

}
