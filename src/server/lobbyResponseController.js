/* 
 * Source-Code for lobbyResponseController
 */

if (typeof module !== "undefined")
{
    module.exports = lobbyResponseController;
}

else
{
    tddjs.namespace("server.controller").lobbyResponseController = lobbyResponseController;
}


function lobbyResponseController()
{
    var _lobby;
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
    
    // Needed because of different Scope in NodeJs
    var _self = this;

    function setLobbyById(aId)
    {
        if(_lobbyController.getLobbyById(aId) === null)
        {
            throw { 
            name:        "LobbyIdError", 
            message:     "Lobby with given Id does not exist",
            toString:    function(){return _self.name + ": " + _self.message;}}; 
        }
        
        _lobby = _lobbyController.getLobbyById(aId);
    }

    function acceptEventSource(req, res)
    {
        if (req.get("accept") === "text/event-stream" && (typeof req.session.token !== "undefined"))
        {
            res.set("content-type", "text/event-stream");
            res.set("cache-control", "no-cache");
            res.set("connection", "keep-alive");
            res.connection.setTimeout(0);


            var player = _lobby.getPlayerByToken(req.session.token);

            if (player === null)
                res.sendStatus(400);

            else
                player.setResponseObject(res);
        }

        else
        {
            res.sendStatus(400);
        }
    }

    function broadcastMessage(aMessage, aEvent, aExcluded)
    {
        if (typeof aMessage !== "object")
            throw new TypeError("Message must be object");

        if (typeof aEvent !== "string")
            throw new TypeError("Event must be string");

        for (var i = 0; i < _lobby.getPlayers().length; ++i)
        {
            var player = _lobby.getPlayers()[i];

            if (player.getType() === "human" && player !== aExcluded)
            {
                var res = player.getResponseObject();
                res.write("event: " + aEvent + "\n" + "data: " + JSON.stringify(aMessage) + "\n\n");
            }

        }
    }
    
    function joinPlayer(aPlayer, aToken)
    {
        aPlayer.setToken(aToken);
        _lobby.addPlayer(aPlayer);
    }
    
    function respondByType(req, res)
    {
        if(typeof req.body === "undefined")
        {
            _self.respondBadRequest(req, res);
            return;
        }
        
        var method = _self.respondMethods[req.body.type];
        
        if(typeof method === "function")
        {
            _self.respondMethods[req.body.type](req, res);
        }
        
        else
        {
            _self.respondBadRequest(req, res);
        }
    }
    
    function respondBadRequest(req, res)
    {
        res.sendStatus(400);
    }
    
    function respondJoin(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.player !== "object")
                throw new Error("Player must not be empty");
            
            if(_lobby.isStarted())
                throw new Error("Lobby already started");
            
            // Is player already logged in lobby as other player?
            if(typeof req.session.token !== "undefined" && _lobby.getPlayerByToken(req.session.token) !== null)
                throw new Error("Player already logged in");
            
            var token = _lobby.getUniqueToken().toString();
            req.session.token = token;
            
            var newPlayer = new tddjs.server.player();
            newPlayer.deserialize(req.body.player);         
     
            _self.joinPlayer(newPlayer, token);
            
            var obj = {};
            obj.lobby = _lobby.serializeAsObject();
            obj.currentPlayerId = newPlayer.getId();
            
            res.json(obj);
            
            _self.broadcastMessage(_lobby.serializeAsObject(), "lobbychange", newPlayer);
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    function respondBotJoin(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(_lobby.isStarted())
                throw new Error("Lobby already started");
            
            var token = req.session.token;
                
            if(typeof token === "undefined" || ! _lobby.isLeaderTokenValid(token))
                throw new Error("Player is not valid");
            
            var bot = _lobby.addBot();
            
            res.sendStatus(200);
            _self.broadcastMessage(_lobby.serializeAsObject(), "lobbychange");
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    function respondKick(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.data.id !== "number")
                throw new Error("Id must be setted");
                
            var token = req.session.token;
                
            if(typeof token === "undefined" || ! _lobby.isLeaderTokenValid(token))
                throw new Error("Player is not valid");
            
            var player = _lobby.getPlayerById(req.body.data.id);
            
            if(player === null)
                throw new Error("Player with Id does not exist");    
                
            _lobby.kickPlayer(player);
                
            res.sendStatus(200);    
            _self.broadcastMessage(_lobby.serializeAsObject(), "lobbychange");
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    function respondLobbyUpdate(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.data !== "object")
                throw new Error("Player must not be empty");
            
            var token = req.session.token;
            
            if(typeof token === "undefined" || ! _lobby.isLeaderTokenValid(token))
                throw new Error("Player is not valid");
            
            if(typeof req.body.data.name === "string")
            {
                _lobby.setName(req.body.data.name);
            }
            
            else if(typeof req.body.data.maxPlayers === "number")
            {
                _lobby.setMaxPlayers(req.body.data.maxPlayers);
            }
            
            res.sendStatus(200);
            _self.broadcastMessage(_lobby.serializeAsObject(), "lobbychange");
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    function respondPlayerUpdate(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.data !== "object")
                throw new Error("Player must not be empty");
            
            if(typeof req.body.data.id !== "number")
                throw new Error("Player Id must be number");
            
            var player = _lobby.getPlayerById(req.body.data.id);
            
            if(player === null)
                throw new Error("Player with Id does not exist");
            
            var token = req.session.token;
            
            if(typeof token === "undefined" || ! _lobby.isPlayerTokenValid(player, token))
                throw new Error("Token must not be undefined");
            
            if(typeof req.body.data.color === "string")
            {
                player.setColor(req.body.data.color);
                res.sendStatus(200);
                
                var wrapper = {
                    id: player.getId(),
                    color: player.getColor()
                };
                
                _self.broadcastMessage(wrapper, "colorchange");
            }
            
            else if(typeof req.body.data.name === "string")
            {
                player.setName(req.body.data.name);
                res.sendStatus(200);
                
                _self.broadcastMessage(_lobby.serializeAsObject(), "lobbychange");
            }
            
            else
            {
                res.sendStatus(400);
            }
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    
    function respondGameStart(req, res)
    {
        try
        {
            var token = req.session.token;
            
            if(typeof token === "undefined" || ! _lobby.isLeaderTokenValid(token))
                throw new Error("Player is not valid");
            
            _lobby.startGame();
            res.sendStatus(200);
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }

    //test
    Object.defineProperty(this, 'lobby', {
        get: function () {
            return _lobby;
        }
    });

    this.joinPlayer = joinPlayer;
    
    this.setLobbyById = setLobbyById;
    this.acceptEventSource = acceptEventSource;
    this.respondJoin = respondJoin;
    this.respondBotJoin = respondBotJoin;
    this.respondKick = respondKick;
    this.broadcastMessage = broadcastMessage;
    this.respondLobbyUpdate = respondLobbyUpdate;
    this.respondPlayerUpdate = respondPlayerUpdate;
    this.respondGameStart = respondGameStart;
    
    this.respondByType = respondByType;
    this.respondBadRequest = respondBadRequest;
   
   
   this.respondMethods = {};
   this.respondMethods["join"] = this.respondJoin;
   this.respondMethods["botJoin"] = this.respondBotJoin;
   this.respondMethods["lobbyUpdate"] = this.respondLobbyUpdate;
   this.respondMethods["playerUpdate"] = this.respondPlayerUpdate;
   this.respondMethods["gameStart"] = this.respondGameStart;
   this.respondMethods["botKick"] = this.respondKick;
   this.respondMethods["playerKick"] = this.respondKick;
   
}