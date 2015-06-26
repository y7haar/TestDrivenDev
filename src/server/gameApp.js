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
  activeDuration: 1000 * 3 //1000 * 60 * 5 
}));


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
        
        if(controllers[req.params.id] === undefined)
        {
            controllers[req.params.id]= new controller();
            controllers[req.params.id].setMaxPlayers(1);
            
            controllers[req.params.id].addClient({
               res:res,
               req:req
            });
            
            
        }
        //console.log(req.session.seenyou);
        console.log("Incomming connection id:"+ req.params.id);
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });        
      
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
        console.log("was undefined");
        res.status(404);
    }
    else
    {
        console.log("found game!");
        controllers[req.params.id].playerMove(req,res);
        res.status(200);
    }
   
});


module.exports = gameApp;