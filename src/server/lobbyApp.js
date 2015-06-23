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
require("./lobbyResponseController");

var lobbyApp = express();

lobbyApp.use(bodyParser.json({}));
lobbyApp.use(logger({}));

var lobbyController = tddjs.server.controller.lobbyController.getInstance();
var lobbyResponseController = new tddjs.server.controller.lobbyResponseController();

lobbyApp.get("", function (req, res) {
    res.send(lobbyController.serialize());
});

lobbyApp.post("", function (req, res) {
    try
    {
        lobbyResponseController.respondNewLobby(req.body);
        res.status(200).end();
    }
    
    catch(e)
    {
        res.status(400).send("Wrong JSON Format");
    }
});

module.exports = lobbyApp;