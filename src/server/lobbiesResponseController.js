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
    
    function respondAllLobbies(req, res)
    {
        var lobbies = _lobbyController.serializeUnstartedAsArray();
        
        res.json(lobbies);
    }
    
    // Needed because of different Scope in NodeJs
    var _self = this;
    
    
    this.respondAllLobbies = respondAllLobbies;
}