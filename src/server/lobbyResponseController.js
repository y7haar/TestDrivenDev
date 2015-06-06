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
        
        try
        {
            var obj = JSON.parse(req);
            
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
    }
    
    this.respondNewLobby = respondNewLobby;
}

