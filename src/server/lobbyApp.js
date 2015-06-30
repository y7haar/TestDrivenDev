/* 
 *  Source-Code for lobby functionalities on NodeJs
 *  This file represents an own Express App
 *  
 *  Test
 */

var express = require("express");
var bodyParser = require("body-parser");
var logger = require('connect-logger');
var sessions = require("client-sessions");

require("./tdd");
require("./serverLobby");
require("./serverPlayer");
require("./lobbyController");
require("./lobbyFactory");
require("./lobbyResponseController");

var LobbyResponseController = require("./NEWlobbyResponseController");
var LobbiesResponseController = require("./lobbiesResponseController");
var lobbyResponseController = new LobbyResponseController();
var lobbiesResponseController = new LobbiesResponseController();

var lobbyApp = express();

lobbyApp.use(bodyParser.json({}));

lobbyApp.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 60 * 60, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 60 * 5 //1000 * 60 * 5 
}));


var lobbyController = tddjs.server.controller.lobbyController.getInstance();

lobbyApp.get("", function (req, res) {
    
    lobbiesResponseController.respondAllLobbies(req, res);

});

lobbyApp.post("", function (req, res) {
    try
    {
        var lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        var response = lobbyResponseController.respondNewLobby(req.body);
        
        req.session.token = lobbyResponseController.getToken();
        
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
        var lrc = new LobbyResponseController();
        lrc.setLobbyById(parseInt(req.params.id));
        lrc.respondByType(req, res);
    }
    catch(e)
    {
        res.sendStatus(400);
    }
});

lobbyApp.get("/:id", function (req, res) {
    try
    {
        var lrc = new LobbyResponseController();
        lrc.setLobbyById(parseInt(req.params.id));
        lrc.acceptEventSource(req, res);
    }
    
    catch(e)
    {
        res.sendStatus(400);
    }
});

module.exports = lobbyApp;