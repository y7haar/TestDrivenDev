/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



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


gameApp.get("/", function (req, res) {
    res.status(200).send("<body> \n\
    <h1>Welcome</h1><br><br>\n\
    <img style='width:45%;' src='http://vignette2.wikia.nocookie.net/animaljam/images/e/e6/Tumblr_static_nyan_cat_animation_new.gif/revision/latest?cb=20140409232417'>  \n\
    </body>");

});

gameApp.get("/secret", function (req, res) {
    res.status(200).send("<body> \n\
    <h1>Welcome</h1><br><br>\n\
    <iframe width='420' height='315' src='https://www.youtube.com/embed/QH2-TGUlwu4' frameborder='0' allowfullscreen></iframe> \n\
    </body>");

});


gameApp.get("/:id", function (req, res) {
    console.log(req.session);
    res.send("Your are in gameApp id:" + req.params.id);
});

module.exports = gameApp;