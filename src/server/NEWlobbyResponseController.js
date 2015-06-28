/* 
 * Source-Code for lobbyResponseController
 */

tddjs.namespace("server.controller").NEWlobbyResponseController= lobbyResponseController;
       
function lobbyResponseController()
{   
   var _lobby;
   
   
    //test
    Object.defineProperty(this, 'lobby', {
        get: function () {
            return _lobby;
        }
    });
}