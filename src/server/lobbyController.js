/* 
 * Source-Code for LobbyController
 */

tddjs.namespace("server.controller").lobbyController =  lobbyController;

function lobbyController()
{
    var _lobbies = [];
    var _count = 0;
    
    function addLobby(aLobby)
    {
        var index = aLobby.getId();

        if(typeof _lobbies[index] !== "undefined")
            throw new Error("Index already in use");

        _lobbies[index] = aLobby;
        _count++;
    }
    
    function removeLobby(aLobby)
    {
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
    
        this.addLobby =  addLobby;
        this.removeLobby = removeLobby;
        this.getLobbyCount = getLobbyCount;
        this.getLobbies = getLobbies;
        this.getLobbyById = getLobbyById;
};
