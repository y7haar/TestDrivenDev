/* 
 * Source-Code for LobbyController
 */

(function()
{
    var _lobbies = [];
    
    function addLobby(aLobby)
    {
        _lobbies.push(aLobby);
    }
    
    function removeLobby(aLobby)
    {
        var index = _lobbies.indexOf(aLobby);
        
        if(index >= 0)
            _lobbies.splice(index, 1);
    }
    2
    function getLobbyCount()
    {
        return _lobbies.length;
    }
    
    function getLobbies()
    {
        return _lobbies;
    }
    
    tddjs.namespace("server.controller").LobbyController = {
        addLobby: addLobby,
        removeLobby: removeLobby,
        getLobbyCount: getLobbyCount,
        getLobbies: getLobbies
        
    };
}());

