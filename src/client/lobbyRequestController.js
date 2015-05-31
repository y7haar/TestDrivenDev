/* 
 *  Source-Code for Lobby Request Controller
 *  
 *  This class handles data exchange with the server for the lobby system
 */

tddjs.namespace("client.controller").lobbyRequestController= lobbyRequestController;
       
function lobbyRequestController()
{   
    var ajax = tddjs.util.ajax;
    
    function requestAllLobbies()
    {
        ajax.get(BASE_URL + "lobbies");
    }
    
    function allLobbiesCallback()
    {
        
    }
    
    this.requestAllLobbies = requestAllLobbies;
    this.allLobbiesCallback = allLobbiesCallback;
};