/* 
 * Source-Code for lobbiesResponseController
 */

if (typeof module !== "undefined")
{
    module.exports = lobbiesResponseController;
}

else
{
    tddjs.namespace("server.controller").lobbiesResponseController = lobbiesResponseController;
}


function lobbiesResponseController()
{
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
    
    // Needed because of different Scope in NodeJs
    var _self = this;
    
    
    function respondAllLobbies(req, res)
    {
        var lobbies = _lobbyController.serializeUnstartedAsArray();
        
        res.json(lobbies);
    }
    
    function respondNewLobby(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.player !== "object")
                throw new Error("Body must have player");
            
            req.session.token = "1234";
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    
    this.respondAllLobbies = respondAllLobbies;
    this.respondNewLobby = respondNewLobby;
}