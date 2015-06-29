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

var lobbyApp = express();

lobbyApp.use(bodyParser.json({}));

lobbyApp.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 20, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 30 //1000 * 60 * 5 
}));


var lobbyController = tddjs.server.controller.lobbyController.getInstance();

lobbyApp.get("", function (req, res) {
    var lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
    res.send(lobbyController.serialize());
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
        var lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        var response = lobbyResponseController.switchLobbyPostTypes(parseInt(req.params.id), req.body);
        
        if(typeof req.session.token ==="undefined")
            req.session.token = lobbyResponseController.getToken();
        
        if(typeof response !== "undefined")
            res.json(response);
        
        else
            res.sendStatus(200);
    }
    
    catch(e)
    {
        console.dir(e);
        res.status(400).send("Wrong JSON Format");
    }
});

lobbyApp.get("/:id", function (req, res) {
    if(req.accepts("text/event-stream"))
    {
        res.type("text/event-stream");
        res.connection.setTimeout(0);
        
        var lobby = lobbyController.getLobbyById(req.params.id);
        var player = lobby.getPlayerByToken(req.session.token.toString());
        player.setResponseObject(res);
        
        console.log("EventSource am Start");
        console.log(req.session.token);
        console.log(lobby.getPlayers()[0].getToken());
    }
    //res.end();
});



module.exports = lobbyApp;