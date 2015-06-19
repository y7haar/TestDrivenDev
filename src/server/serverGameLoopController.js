/* 
 * Source-code for gameLoopController that will be running on the nodeJs Server
 */


if(typeof module !== "undefined")
{
    module.exports = gameLoopController;
}
else
    tddjs.namespace("server.controller").gameLoopController =  gameLoopController;

function gameLoopController()
{
    var _clients =[];
    
    function addClient(aClient)
    {
        _clients.push(aClient);
    }
    
    //test
    Object.defineProperty(this, 'clients', {
        get: function () {
            return _clients;
        }
    });
    
    this.addClient = addClient;
    
}