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

var lobbyController = tddjs.server.controller.lobbyController.getInstance();
var lobbyResponseController = new tddjs.server.controller.lobbyResponseController();

lobbyApp.get("", function (req, res) {
    res.send(lobbyController.serialize());
});

lobbyApp.post("", function (req, res) {
    try
    {
        var response = lobbyResponseController.respondNewLobby(req.body);
        res.json(response);
    }
    
    catch(e)
    {
        res.status(400).send("Wrong JSON Format");
    }
});

lobbyApp.post("/:id", function (req, res) {
    try
    {

        var response = lobbyResponseController.switchLobbyPostTypes(parseInt(req.params.id), req.body);
        
        res.json(response);
    }
    
    catch(e)
    {
        res.status(400).send("Wrong JSON Format");
    }
});



module.exports = lobbyApp;