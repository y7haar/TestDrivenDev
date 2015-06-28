/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").NEWlobbyResponseController= lobbyResponseController;
       
function lobbyResponseController()
{   
   var _lobby;
   var _lobbyController = tddjs.server.controller.lobbyController.getInstance();
   
   
   function setLobbyById(aId)
   {
       _lobby = _lobbyController.getLobbyById(aId);
   }
   
   function acceptEventSource(req, res)
   {
       if(req.get("accept") === "text/event-stream" && (typeof req.session.token !== "undefined"))
       {
           res.append("content-type", "text/event-stream");
           res.append("cache-control", "no-cache");
           res.append("connection", "keep-alive");
           res.connection.setTimeout(0);
           
           
           var player = _lobby.getPlayerByToken(req.session.token);
           
           if(player === null)
               res.sendStatus(400);
               
            else
                player.setResponseObject(res);
       }
       
       else
       {
           res.sendStatus(400);
       }
   }
   
   function broadcastMessage(aMessage, aEvent)
    {
        if(typeof aMessage !== "object")
            throw new TypeError("Message must be object");
        
        if(typeof aEvent !== "string")
            throw new TypeError("Event must be string");
        
        for(var i = 0;i < _lobby.getPlayers().length;++i)
        {
            var player = _lobby.getPlayers()[i];
            
            if(player.getType() === "human")
            {
                var res = player.getResponseObject();
                res.write("event: " + aEvent + "\n" + "data: " + JSON.stringify(aMessage) + "\n\n");
            }

        }
    }
   
   
    //test
    Object.defineProperty(this, 'lobby', {
        get: function () {
            return _lobby;
        }
    });
    
    
    this.setLobbyById = setLobbyById;
    this.acceptEventSource = acceptEventSource;
    this.broadcastMessage = broadcastMessage;
}