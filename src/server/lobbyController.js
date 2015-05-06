/* 
 * Source-Code for LobbyController
 */

(function()
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
        
        console.log("array add: " + _lobbies);
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
        console.log("array: " + _lobbies);
        
        if(isNaN(aId))
            throw new TypeError("Parameter is not a number");
        
        var lobby = _lobbies[aId];
        
        if(typeof(lobby) === "undefined" || lobby === null )
            throw new Error("Lobby with id " + aId + " doesnt exist");
        
        return lobby;
    }
    
    tddjs.namespace("server.controller").LobbyController = {
        addLobby: addLobby,
        removeLobby: removeLobby,
        getLobbyCount: getLobbyCount,
        getLobbies: getLobbies,
        getLobbyById: getLobbyById
        
    };
}());

