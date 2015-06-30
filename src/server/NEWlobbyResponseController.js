/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").NEWlobbyResponseController = lobbyResponseController;

function lobbyResponseController()
{
    var _lobby;
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();


    function setLobbyById(aId)
    {
        if(_lobbyController.getLobbyById(aId) === null)
        {
            throw { 
            name:        "LobbyIdError", 
            message:     "Lobby with given Id does not exist",
            toString:    function(){return this.name + ": " + this.message;}}; 
        }
        
        _lobby = _lobbyController.getLobbyById(aId);
    }

    function acceptEventSource(req, res)
    {
        if (req.get("accept") === "text/event-stream" && (typeof req.session.token !== "undefined"))
        {
            res.append("content-type", "text/event-stream");
            res.append("cache-control", "no-cache");
            res.append("connection", "keep-alive");
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

    function broadcastMessage(aMessage, aEvent)
    {
        if (typeof aMessage !== "object")
            throw new TypeError("Message must be object");

        if (typeof aEvent !== "string")
            throw new TypeError("Event must be string");

        for (var i = 0; i < _lobby.getPlayers().length; ++i)
        {
            var player = _lobby.getPlayers()[i];

            if (player.getType() === "human")
            {
                var res = player.getResponseObject();
                res.write("event: " + aEvent + "\n" + "data: " + JSON.stringify(aMessage) + "\n\n");
            }

        }
    }
    
    function respondJoin(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.player !== "object")
                throw new Error("Player must not be empty");
            
            
            var token = _lobby.getUniqueToken().toString();
            req.session.token = token;
            
            var newPlayer = new tddjs.server.player();
            newPlayer.deserialize(req.body.player);
            
            this.joinPlayer(newPlayer, token);
            
            var obj = {};
            obj.lobby = _lobby.serializeAsObject();
            obj.currentPlayerId = newPlayer.getId();
            
            res.json(obj);
            
            this.broadcastMessage(_lobby.serializeAsObject(), "lobbychange");
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
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    function _joinPlayer(aPlayer, aToken)
    {
        aPlayer.setToken(aToken);
        _lobby.addPlayer(aPlayer);
    }


    //test
    Object.defineProperty(this, 'lobby', {
        get: function () {
            return _lobby;
        }
    });


    this.setLobbyById = setLobbyById;
    this.acceptEventSource = acceptEventSource;
    this.respondJoin = respondJoin;
    this.broadcastMessage = broadcastMessage;
    this.respondLobbyUpdate = respondLobbyUpdate;
    
   // Should be private
   this.joinPlayer = _joinPlayer;
}