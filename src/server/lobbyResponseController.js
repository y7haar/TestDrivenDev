/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").lobbyResponseController= lobbyResponseController;
       
function lobbyResponseController()
{   
    function respondNewLobby(req)
    {
        if(typeof req !== "string")
            throw new TypeError("Request must be string");
    }
    
    this.respondNewLobby = respondNewLobby;
}

