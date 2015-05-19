/* 
 * Source-Code for LobbyController
 */

tddjs.namespace("server.controller").lobbyController =  lobbyController;
tddjs.namespace("server.controller.lobbyController").getInstance =  getInstance;

var _lobbyControllerInstance = null;

function getInstance()
{
    if(_lobbyControllerInstance === null)
        _lobbyControllerInstance = new tddjs.server.controller.lobbyController();
    return _lobbyControllerInstance;
}

function lobbyController()
{
    var _lobbies = [];
    var _count = 0;
    var _nextId = 0;
    
    function addLobby(aLobby)
    {
        if(!(aLobby instanceof tddjs.server.model.lobby))
            throw new TypeError("Parameter is not a Lobby");
        
        var index = aLobby.getId();

        if(typeof _lobbies[index] != "undefined")
            throw new Error("Index already in use");
        
        _lobbies[index] = aLobby;
        _count++;
    }
    
    function removeLobby(aLobby)
    {
        if(!(aLobby instanceof tddjs.server.model.lobby))
            throw new TypeError("Parameter is not a Lobby");
        
        var index = _lobbies.indexOf(aLobby);
        
        if(index >= 0)
        {
            delete _lobbies[index];
            _count--;
        }
    }
    
    function getLobbyCount()
    {
        return _count;
    }
    
    function getLobbies()
    {
        return _lobbies;
    }

    function getLobbyById(aId)
    {      
        if(isNaN(aId))
            throw new TypeError("Parameter is not a number");
        
        var lobby = _lobbies[aId];
        
        if(typeof(lobby) === "undefined" || lobby === null )
            throw new Error("Lobby with id " + aId + " doesnt exist");
        
        return lobby;
    }
    
    function getNextId()
    {
        var currentId = _nextId;
        _nextId++;
        
        return currentId;
    }
    
    function serialize()
    {
        var lobbies = [];
        
        for(var i=0;i < _lobbies.length;++i)
        {
            var lobby = _lobbies[i];
            
            if(typeof lobby === "undefined")
                continue;
            
            var lobbyObj= lobby.serializeAsObject();
            lobbies.push(lobbyObj);
        }
        
        var lobbiesJson = JSON.stringify(lobbies);
        
        console.log(lobbiesJson);
        
        return lobbiesJson;
    }
    
        this.addLobby =  addLobby;
        this.removeLobby = removeLobby;
        
        this.getLobbyCount = getLobbyCount;
        this.getLobbies = getLobbies;
        
        this.getLobbyById = getLobbyById;
        this.getNextId = getNextId;
        
        this.serialize = serialize;

};
