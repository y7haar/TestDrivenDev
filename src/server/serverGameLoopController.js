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
    var _map = null;
    var _clients =[];
    var _maxPlayers = -1;
    var _allConnected = false;
    
    function addClient(aClient)
    {
        _clients.push(aClient);
        if(_clients.length === _maxPlayers)
        {
            _allConnected = true;
            
            var msg = {
                unitCount:12,
                info:"changeToPlacing"
            };
            msg = JSON.stringify(msg);            
            var data = "event:changeToPlacing\ndata:"+msg+"\n\n";
            _clients[0].res.write(data);
        }
    }
    function setMaxPlayers(intValue)
    {
        _maxPlayers = intValue;
    }
    
    function setMap(aMap)
    {
        _map = aMap;
    }
    
    function playerMove(req, res)
    {
        type = JSON.parse(req.body).type;
        switch(type)
        {
            case 'endPhase':
                console.log(res);
                res.status(200).send("OK");
                break;
            default:
                res.status(404).send("404");
            break;    
                
        }
        
    }
    
    function messageAll()
    {
        
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
    Object.defineProperty(this, 'messageAll', {
        get: function () {
            return messageAll;
        }
    });
    Object.defineProperty(this, 'map', {
        get: function () {
            return _map;
        }
    });
    
    this.playerMove = playerMove;
    this.setMap = setMap;
    this.setMaxPlayers = setMaxPlayers;
    this.addClient = addClient;
    
}