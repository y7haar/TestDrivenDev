/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var express = require("express");
var bodyParser = require("body-parser");
var logger = require('connect-logger');
var sessions = require("client-sessions");
var test = require("./testModule.js");
var controller = require("./serverGameLoopController.js");

var gameApp = express();

var controllers = {};

gameApp.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 60, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 60 //1000 * 60 * 5 
}));

// setting sessions for testing later  lobbie will make this
gameApp.use(function(req, res, next) {
  if (req.session.seenyou) {
    res.header('X-Seen-You', 'true');
  } 
  else {
    req.session.seenyou = true;
    res.header('X-Seen-You', 'false');
  }  
  next();
});

gameApp.get("/", function (req, res) {
    res.send("<body> \n\
    <h1>Welcome</h1><br><br>\n\
    </body>");

});

gameApp.get("/secret", function (req, res) {
 
    var x = Math.floor((Math.random() * (test.length - 0)) + 0);
    res.send(test[x]);
});


gameApp.get("/:id", function (req, res) {
    if(req.headers.accept === 'text/event-stream')
    {
        console.log(req.session.seenyou);
        res.header('Content-Type', 'text/event-stream');
        res.header('Cache-Control', 'no-cache');
        res.header('Connection', 'keep-alive');  
        res.connection.setTimeout(0);
        
        if(controllers[req.params.id] === undefined)
        {
            controllers[req.params.id]= new controller();
            controllers[req.params.id].setMaxPlayers(2);
            
        }      

        controllers[req.params.id].addClient({
            res: res,
            req: req
        });   
        //console.log(req.session.seenyou);
        console.log("Incomming connection id:"+ req.params.id); 
           
    }
    else
    {
        console.log("GET-Request but not event-stream");
        res.sendStatus(404);
    }
});

gameApp.post("/:id", function (req, res) {
    console.log("POST-Request:"); 
    
    if(controllers[req.params.id] === undefined)
    {
        console.log("no game found with id:"+req.params.id+ " requests denied");
        res.sendStatus(404);
    }
    else
    {
        console.log("found game!");     
        controllers[req.params.id].playerMove(req,res);        
    }
   
});


module.exports = gameApp;