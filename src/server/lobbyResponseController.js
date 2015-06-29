/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").lobbyResponseController= lobbyResponseController;
       
function lobbyResponseController()
{   
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
    var _lobbyFactory = new tddjs.server.controller.lobbyFactory();
    var _methodTypes = {};
    var _currentToken;
    var _response;
    var _lobbyId;
    var _message;
    var _event;
    
    function setToken(aToken)
    {
        if(typeof aToken !== "string")
            throw new TypeError("Token must be string");
        
        _currentToken = aToken;
    }
    
    function getToken()
    {
        return _currentToken;
    }
    
    function setResponse(res)
    {
        _response = res;
    }
    
    function broadcastMessage(aLobbyId, aMessage, aEvent)
    {
        if(typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");
        
        if(typeof aMessage !== "object")
            throw new TypeError("Message must be object");
        
        if(typeof aEvent !== "string")
            throw new TypeError("Event must be string");
        
        var lobby = _lobbyController.getLobbyById(aLobbyId);
        
        for(var i = 0;i < lobby.getPlayers().length;++i)
        {
            var res = lobby.getPlayers()[i].getResponseObject();
            res.write("event: " + aEvent + "\n" + "data: " + JSON.stringify(aMessage) + "\n\n");
        }
    }
    
    function respondNewLobby(obj)
    {    
        if(typeof obj !== "object")
            throw new TypeError("Request must be object");
        
        try
        {
            
            var player = obj.player;
            if(typeof player !== "object")
                throw new Error("Player must be an object");
            
            if(typeof player.name !== "string")
                throw new Error("Name must be a string");
            
            if(typeof player.color !== "string")
                throw new Error("Color must be a string");
            
            var lobby = _lobbyFactory.getNewLobby();
            var leader = new tddjs.server.player();
            
            var token = lobby.getUniqueToken();
            leader.deserialize(obj.player);
            leader.setToken(token);
            this.setToken(token);

            lobby.addPlayer(leader);
            lobby.setLeader(leader);
            _lobbyController.addLobby(lobby);
            
            var obj = {};
            obj.lobby = lobby.serializeAsObject();
            obj.currentPlayerId = leader.getId();
            
            return obj;
            
        }
        catch(e)
        {
            throw new Error("JSON is not valid");
        }
        
    }
    
    function respondJoin(id, obj)
    {    
        if(typeof obj !== "object")
            throw new TypeError("Request must be object");
        
        if(typeof id !== "number")
            throw new TypeError("Id must be number");
        
        try
        {
            
            var player = obj.player;
            if(typeof player !== "object")
                throw new Error("Player must be an object");
            
            if(typeof player.name !== "string")
                throw new Error("Name must be a string");
            
            if(typeof player.color !== "string")
                throw new Error("Color must be a string");
        }
        catch(e)
        {
            throw new Error("JSON is not valid");
        }
        
        try
        {
            var lobby = _lobbyController.getLobbyById(id);
            var newPlayer = new tddjs.server.player();
            newPlayer.deserialize(obj.player);
           
            var token = lobby.getUniqueToken();      
            newPlayer.setToken(token);
            _currentToken = token;

            lobby.addPlayer(newPlayer);
            
            var obj = {};
            obj.lobby = lobby.serializeAsObject();
            obj.currentPlayerId = newPlayer.getId();
            
            //broadcastMessage(id, lobby.serializeAsObject(), "lobbychange");
            
            return obj;
        }
        
        catch(e)
        {
            throw { 
            name:        "LobbyIdError", 
            message:     "Lobby with given Id does not exist",
            toString:    function(){return this.name + ": " + this.message;} 
}; 
        }
    }
    
    function respondLobbyUpdate(id, obj)
    {
        if(typeof obj !== "object")
            throw new TypeError("Request must be object");
        
        if(typeof id !== "number")
            throw new TypeError("Id must be number");
        
        if(typeof obj.data !== "object")
        {
            throw new Error("Object must contain data");
        }
        
        try
        {
            var lobby = _lobbyController.getLobbyById(id);
            
            if(typeof obj.data.maxPlayers === "number")
            {
                lobby.setMaxPlayers(obj.data.maxPlayers);
            }
            
            if(typeof obj.data.name === "string")
            {
                lobby.setName(obj.data.name);
            }
            
            broadcastMessage(id, lobby.serializeAsObject(), "lobbychange");
        }
        catch(e)
        {
            throw { 
            name:        "LobbyIdError", 
            message:     "Lobby with given Id does not exist",
            toString:    function(){return this.name + ": " + this.message;} 
}; 
        }
    }
    
    function respondPlayerUpdate(id, obj)
    {
        if(typeof obj !== "object")
            throw new TypeError("Request must be object");
        
        if(typeof id !== "number")
            throw new TypeError("Id must be number");
        
        if(typeof obj.data !== "object")
        {
            throw new Error("Object must contain data");
        }
        
        try
        {
            var lobby = _lobbyController.getLobbyById(id);
            
            if(typeof obj.data.id !== "number")
                throw new TypeError("Id must be setted");
            
            var playerId = obj.data.id;
            
            if(typeof obj.data.color === "string")
            {
                lobby.getPlayerById(playerId).setColor(obj.data.color);
                var wrapper = {
                    id: playerId,
                    color: obj.data.color
                };
                
                broadcastMessage(id, wrapper, "colorchange");
            }
            
            if(typeof obj.data.name === "string")
            {
                lobby.getPlayerById(playerId).setName(obj.data.name);
                
                broadcastMessage(id, lobby.serializeAsObject(), "lobbychange");
            }
        }
        catch(e)
        {
            throw { 
            name:        "LobbyIdError", 
            message:     "Lobby with given Id does not exist",
            toString:    function(){return this.name + ": " + this.message;} 
}; 
        }
    }
    
    function switchLobbyPostTypes(id, data)
    {
        var type = data.type;
        
        if(typeof _methodTypes[type] === "function")
        {
           return  _methodTypes[type](id, data);
        }
            
    }
    
    this.switchLobbyPostTypes = switchLobbyPostTypes;
    this.respondNewLobby = respondNewLobby;
    this.respondJoin = respondJoin;
    this.respondLobbyUpdate = respondLobbyUpdate;
    this.respondPlayerUpdate = respondPlayerUpdate;
    this.setToken = setToken;
    this.getToken = getToken;
    
    this.broadcastMessage = broadcastMessage;
    this.setResponse = setResponse;
    
    _methodTypes["lobbyUpdate"] = this.respondLobbyUpdate;
    _methodTypes["playerUpdate"] = this.respondPlayerUpdate;
    _methodTypes["join"] = this.respondJoin;
}