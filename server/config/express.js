const bodyParser = require('body-parser');
const  express = require('express');
const path = require('path');

module.exports = function (app,root) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use("/", express.static(path.join(root, 'client')));
    app.use("/game", express.static(path.join(root, 'client')));
    app.use("/login", express.static(path.join(root, 'client')));
    app.use(express.static(path.join(root, 'client')));

}
