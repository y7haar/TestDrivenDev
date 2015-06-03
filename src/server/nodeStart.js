var connect = require('connect');
var serveStatic = require('serve-static');
var logger = require('connect-logger');

var app = connect();
app.use(serveStatic(__dirname)).listen(8080);
app.use(logger({}));