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
    var _currentClient = null;
    
    function addClient(aClient)
    {
        _clients.push(aClient);
        if(_clients.length === _maxPlayers)
        {
            _allConnected = true;
            
            // starting game, changeing currentPlayer to first player in array
            
            _currentClient = 0;
            var msg = {
                unitCount:12,
                info:"changeToPlacing"
            };
            msg = JSON.stringify(msg);            
            var data = "event:changeToPlacing\ndata:"+msg+"\n\n";            
            _clients[_currentClient].res.write(data);
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
        var type = JSON.parse(req.body).type;
        var body = JSON.parse(req.body);       
        switch (type)
        {
            case 'endPhase':             
                res.status(200).send("OK");
                if (body.phaseName === "placingState")
                {
                    var data = "event:changeToAttacking\ndata:ChangeToAttacking\n\n";
                    _clients[_currentClient].res.write(data);
                }
                else if (body.phaseName === "attackingState")
                {
                    var data = "event:changeToWaiting\ndata:ChangeToWaiting\n\n";
                    _clients[_currentClient].res.write(data);
                    // next Client
                    _currentClient++;                    
                    // start at first Client if lastClient ended his turn
                    if(_currentClient === _clients.length)_currentClient = 0;
                    
                    var msg = {
                        unitCount: 12,
                        info: "changeToPlacing"
                    };
                    msg = JSON.stringify(msg);   
                    var data = "event:changeToPlacing\ndata:"+msg+"\n\n";            
                    _clients[_currentClient].res.write(data);
                }
                break;
            case 'placing':
                res.status(200).send("OK");               
                
                var msg = {
                  type:body.type,
                  player:body.player,
                  change:{
                      continent:body.continent,
                      country:body.country,
                      unitCount:body.unitCount                      
                    }
                };               
                msg = JSON.stringify(msg);
                var data = "event:placeUnits\ndata:"+msg+"\n\n";            
                _clients[_currentClient].res.write(data);
                break;
            case 'attack':                 
                res.status(200).send("OK");
                var msg = {
                    type: "attacking",
                    attacker: {
                        player: "Peter",
                        outcome: "winner"
                    },
                    defender: {
                        player: "Hanswurst",
                        outcome: "loser"
                    },
                    changes: [
                        {
                            continent: "Europa",
                            country: "Country1",
                            unitCount: 1,
                            owner: "Peter"
                        },
                        {
                            continent: "Europa",
                            country: "Country2",
                            unitCount: 6,
                            owner: "Hanswurst"
                        }
                    ]
                    };
                msg = JSON.stringify(msg);
                var data = "event:attackResult\ndata:"+msg+"\n\n";            
                _clients[_currentClient].res.write(data);   
            
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
    Object.defineProperty(this, 'currentClient', {
        get: function () {
            return _currentClient;
        }
    });
    
    this.playerMove = playerMove;
    this.setMap = setMap;
    this.setMaxPlayers = setMaxPlayers;
    this.addClient = addClient;
    
}