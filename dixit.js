const express = require('express');
const app = express();
const server = app.listen(5002);
const io = require('socket.io')(server);

require('./server/config/express')(app,__dirname);
require('./server/services/socket')(io,require('immutable').Map({}));
require('./server/config/routes')(app,io);