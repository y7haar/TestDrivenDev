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
        getLobbyCount: getLobbyCount,
        getLobbies: getLobbies
        
    };
}());

