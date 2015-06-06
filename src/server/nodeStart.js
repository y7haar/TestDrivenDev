/*
 *  External Requires
 */
var logger = require('connect-logger');
var express = require('express');
var sessions = require("client-sessions");
var cors = require('cors');
var bodyParser = require("body-parser");


/*
 *  Internal Requires
 */
var namespace = require('../lib/tdd');


var app = express();


/*
 *  IMPORTANT: 
 *  This must be removed on Integration
 */
app.use(cors());
/*
 *  This will stay
 */


app.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 2, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 3 //1000 * 60 * 5 
}));

app.use(bodyParser.json({}));
app.use(logger({}));


app.listen(8080);


/*
 *  Routing information
 */
app.all("*", function (req, res, next) {
    req.accepts("application/json");
    
    console.log("Token; " + req.session.token);
    next();
});

/*
 *  This is hard coded for testing purposes
 */

app.get('/lobbies', function (req, res) {
  res.json([
      {
          id: 1,
          name: "NoobFunServer",
          maxPlayers:4,
          players: [
              {
                  name: "Hans",
                  color:"#ffffff"
              }]
  },
  
  {
          id: 2,
          name: "OnlyPros",
          maxPlayers:4,
          players: [
              {
                  name: "Hans",
                  color:"#ffffff"
              },
          {
                  name: "Hans",
                  color:"#ffffff"
              }]
  },
  
  {
          id: 3,
          name: "I_Will D3stroY Al1 !!!",
          maxPlayers:4,
          players: [
              {
                  name: "Hans",
                  color:"#ffffff"
              }]
  }
  ]);
});

app.get('/lobbies/:id', function (req, res) {
  res.send('Lobby ' + req.params.id);
});

app.post('/lobbies/:id', function (req, res) {
   
   console.log("POST to " + req.path);
   console.log(req.body);
   
    if(typeof req.session.token === "undefined")
    {
        console.log("SESSION UNDEFINED");
        req.session.token = parseInt((Math.random() * 100000000));
    }
    
  res.send('Lobby ' + req.params.id);
});








var nlg = require('./nameListGenerator');

var nameListGenerator = new nlg();


nameListGenerator.readFileList(nameListGenerator.DEFAULT_LIST, function(){
    console.log("DONE");
    nameListGenerator.shuffleNameList();
    console.log(nameListGenerator.getNameList());
    
});