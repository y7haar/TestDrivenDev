/*
 *  External Requires
 */
var logger = require('connect-logger');
var express = require('express');
var sessions = require("client-sessions");
var bodyParser = require("body-parser");

console.log("loaded all modules.");

GLOBAL.lobbyApp = require("./lobbyApp");
GLOBAL.gameApp = require("./gameApp");

console.log("loaded all Apps.");





/*
 *  Internal Requires
 */
var namespace = require('./tdd');
var NameListGenerator = require('./nameListGenerator');

var continentGenerator = new NameListGenerator();
var countryGenerator = new NameListGenerator();

continentGenerator.readFileList(continentGenerator.CONTINENT_LIST);
countryGenerator.readFileList(countryGenerator.COUNTRY_LIST);

GLOBAL.CONTINENT_NAMES_ARRAY = continentGenerator.getNameList();
GLOBAL.COUNTRY_NAMES_ARRAY = countryGenerator.getNameList();

console.log("Loaded Namelists");

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
  duration: 1000 * 60 * 60, // 1 Day valid 24 * 60 * 60 * 1000
  activeDuration: 1000 * 60 * 5 //1000 * 60 * 5 
}));

app.use(bodyParser.json({}));
app.use(logger({}));


app.listen(8181);

console.log("Server started on port 8181");

/*
 *  Routing information
 */
app.all("*", function (req, res, next) {
    
    useCors(req, res);
    
    req.accepts("application/json");

    next();
});

app.get("/", function (req, res) {
    res.redirect("/public/lobbies.html");
});


app.get('/public/*', function (req, res) {
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params[0];
  
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});

console.log("routing...");

app.use("/game", gameApp);
app.use("/lobbies", lobbyApp);


console.log("routed all apps. ");

/*
 *  Name List generator
 */


