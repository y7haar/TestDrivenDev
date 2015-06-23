/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").lobbyResponseController= lobbyResponseController;
       
function lobbyResponseController()
{   
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
    var _lobbyFactory = new tddjs.server.controller.lobbyFactory();
    
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
            leader.deserialize(obj.player);
            //leader.setToken(req.session.token);

            lobby.addPlayer(leader);
            lobby.setLeader(leader);
            _lobbyController.addLobby(lobby);
            
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
            //newPlayer.setToken(req.session.token);

            lobby.addPlayer(newPlayer);
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
    
    this.respondNewLobby = respondNewLobby;
    this.respondJoin = respondJoin;
}

