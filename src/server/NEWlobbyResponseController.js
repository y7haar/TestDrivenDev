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
       if(req.get("accept") === "text/event-stream")
       {
           res.append("content-type", "text/event-stream");
           res.append("cache-control", "no-cache");
           res.append("connection", "keep-alive");
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
}