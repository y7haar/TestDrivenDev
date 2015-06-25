/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = gameApp;


var express = require("express");
var bodyParser = require("body-parser");
var logger = require('connect-logger');
var sessions = require("client-sessions");

var gameApp = express();

gameApp.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 60, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 3 //1000 * 60 * 5 
}));


gameApp.get("/", function(req,res){

	console.dir(req);
        console.log("---------------------------------------");
        console.dir(res);
});

gameApp.get("/:id", function(req,res){

	console.log(req.session);
	res.send("Your are in gameApp id:"+req.params.id);
});