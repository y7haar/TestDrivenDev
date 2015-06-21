/* 
 *  Source-Code for lobby functionalities on NodeJs
 *  This file represents an own Express App
 */

var express = require("express");
var bodyParser = require("body-parser");
var logger = require('connect-logger');

require("./tdd");
require("./serverLobby");
require("./serverPlayer");
require("./lobbyController");
require("./lobbyFactory");

var lobbyApp = express();

lobbyApp.use(bodyParser.json({}));
lobbyApp.use(logger({}));

var lobbyController = tddjs.server.controller.lobbyController.getInstance();

lobbyApp.get("", function (req, res) {
    res.send(lobbyController.serialize());
});

module.exports = lobbyApp;