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
    var _maxPlayers = -1;
    var _allConnected = false;
    
    function addClient(aClient)
    {
        _clients.push(aClient);
        if(_clients.length === _maxPlayers)
            _allConnected = true;
    }
    function setMaxPlayers(intValue)
    {
        _maxPlayers = intValue;
    }
    
    //test
    Object.defineProperty(this, 'clients', {
        get: function () {
            return _clients;
        }
    });
    Object.defineProperty(this, 'maxPlayers', {
        get: function () {
            return _maxPlayers;
        }
    });
    Object.defineProperty(this, 'allConnected', {
        get: function () {
            return _allConnected;
        }
    });
    
    this.setMaxPlayers = setMaxPlayers;
    this.addClient = addClient;
    
}