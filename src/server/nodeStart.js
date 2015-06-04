var serveStatic = require('serve-static');
var logger = require('connect-logger');
var express = require('express');
var sessions = require("client-sessions");

var namespace = require('../lib/tdd');

console.log(namespace);

var app = express();



app.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 2, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 3 //1000 * 60 * 5 
}));


app.all("*", function (req, res, next) {
    console.log("ALL");
    console.log("Token; " + req.session.token);
    
    
    if(typeof req.session.token === "undefined")
    {
        console.log("SESSION UNDEFINED");
        req.session.token = parseInt((Math.random() * 100000000));
    }
    
    next();
});

app.get('/lobbies', function (req, res) {
  res.send('Lobbies!');
});

app.get('/lobbies/:id', function (req, res) {
  res.send('Lobby ' + req.params.id);
});

app.post('/lobbies/:id', function (req, res) {
  res.send('Lobby ' + req.params.id);
});

var nlg = require('./nameListGenerator');

var nameListGenerator = new nlg();


nameListGenerator.readFileList(nameListGenerator.DEFAULT_LIST, function(){
    console.log("DONE");
    nameListGenerator.shuffleNameList();
    console.log(nameListGenerator.getNameList());
    
});


//app.use(serveStatic(__dirname)).listen(8080);
app.use(logger({}));
app.listen(8080);