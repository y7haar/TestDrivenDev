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
        var options = {
          onSuccess: this.allLobbiesCallback  
        };
        
        ajax.get(BASE_URL + "lobbies", options);
    }
    
    function allLobbiesCallback()
    {
        console.log("ALL LOBBIES");
    }
    
    this.requestAllLobbies = requestAllLobbies;
    this.allLobbiesCallback = allLobbiesCallback;
};