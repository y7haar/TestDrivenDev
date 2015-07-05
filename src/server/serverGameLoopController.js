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
        console.log("add Client. connected Clients: "+_clients.length);
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
    
    // This method should place units in map
    // No Validation checking is needed
    function placeUnits(aCountry, aCount)
    {
        
    }
    
    // Method should return count of new units when a new round is started
    // It should also include Continent Bonus if player owns whole contintent
    function getUnitStockByPlayer(aPlayer)
    {
        
    }
    
    // This method should update map with battle result of two countries
    //No Validation is needed
    function attack(aFrom, aTo)
    {
        
    }
    
    function playerMove(req, res)
    {      
        var type = req.body.type;
        var body = req.body;       
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
    
    var messageAllClientsCalled = false;
    function messageAllClients()
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
    Object.defineProperty(this, 'messageAllClients', {
        get: function () {
            return messageAllClients;
        }
    });
    Object.defineProperty(this, 'messageAllClientsCalled', {
        get: function () {
            return messageAllClientsCalled;
        }
    });    
    
    this.playerMove = playerMove;
    this.setMap = setMap;
    this.setMaxPlayers = setMaxPlayers;
    this.addClient = addClient;
    
    this.attack = attack;
    this.placeUnits = placeUnits;
    this.getUnitStockByPlayer = getUnitStockByPlayer;
    
}