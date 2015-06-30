/*
 *  External Requires
 */
var logger = require('connect-logger');
var express = require('express');
var sessions = require("client-sessions");
var bodyParser = require("body-parser");

console.log("loaded all modules.");

var lobbyApp = require("./lobbyApp");
var gameApp = require("./gameApp");

console.log("loaded all Apps.");

/*
 *  Internal Requires
 */
var namespace = require('./tdd');

var app = express();


/*
 *  IMPORTANT: 
 *  This must be removed  or setted empty on Integration
 */
function useCors(req, res)
{
    //to allow cross domain requests to send cookie information.
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',  req.headers.origin);

    // list of methods that are supported by the server
    res.header('Access-Control-Allow-Methods','OPTIONS,GET,POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
}

/*
 *  This will stay
 */


app.use(sessions({
  cookieName: 'session',
  secret: 'usdnzfu303un04fu43fnpp09suwendwe', 
  duration: 1000 * 20, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 30 //1000 * 60 * 5 
}));

app.use(bodyParser.json({}));
app.use(logger({}));


app.listen(8080);

console.log("Server started on port 8080");

/*
 *  Routing information
 */
app.all("*", function (req, res, next) {
    
    useCors(req, res);
    
    req.accepts("application/json");

    next();
});

//app.post('/lobbies/:id', function (req, res) {
//
//   console.log(req.body);
//   
//    if(typeof req.session.token === "undefined")
//    {
//        console.log();
//        console.log("SESSION UNDEFINED");
//        req.session.token = parseInt((Math.random() * 100000000));
//        console.log("NEW TOKEN: " + req.session.token);
//        console.log();
//    }
//    
//  res.send('Lobby ' + req.params.id);
//});


console.log("routing...");

app.use("/lobbies", lobbyApp);
app.use("/game", gameApp);

console.log("routed all apps. ");

/*
 *  Name List generator
 */


var nlg = require('./nameListGenerator');

var nameListGenerator = new nlg();

nameListGenerator.readFileList(nameListGenerator.COUNTRY_LIST);
nameListGenerator.shuffleNameList();
console.log(nameListGenerator.getNameList());