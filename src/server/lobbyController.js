/* 
 * Source-Code for LobbyController
 */

(function()
{
    var _lobby;
    
    function addLobby(aLobby)
    {
        _lobby = aLobby;
    }
    
    function getLobbyCount()
    {
        if(typeof _lobby === "undefined")
            return 0;
        
        return 1;
    }
    
    tddjs.namespace("server.controller").LobbyController = {
        addLobby: addLobby,
        getLobbyCount: getLobbyCount
        
    };
}());

