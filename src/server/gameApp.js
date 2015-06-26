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

var gameApp = express();

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
    console.log(req.session);
    res.send("Your are in gameApp id:" + req.params.id);
});



module.exports = gameApp;