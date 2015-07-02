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
    
    function _initializeLobby(aLobby, req, res)
    {
        var leader = new tddjs.server.player();
        var token = aLobby.getUniqueToken();
        
        req.session.token = token;
        
        leader.deserialize(req.body.player);
        
        leader.setToken(token);
        
        aLobby.addPlayer(leader);
        aLobby.setLeader(leader);
    }
    
    function respondNewLobby(req, res)
    {
        try
        {
            if(typeof req.body !== "object")
                throw new Error("Body must not be empty");
            
            if(typeof req.body.player !== "object")
                throw new Error("Body must have player");
            
            var lobbyFactory = new tddjs.server.controller.lobbyFactory();
            var lobby = lobbyFactory.getNewLobby();
            
            _self._initializeLobby(lobby, req, res);
            
            tddjs.server.controller.lobbyController.getInstance().addLobby(lobby);
            
            var wrapper = {};
            wrapper.currentPlayerId = lobby.getLeader().getId();
            wrapper.lobby = lobby.serializeAsObject();
            
            res.json(wrapper);
        }
        
        catch(e)
        {
            res.sendStatus(400);
        }
    }
    

    
        // private
    this._initializeLobby = _initializeLobby;
    
    this.respondAllLobbies = respondAllLobbies;
    this.respondNewLobby = respondNewLobby;
    

}