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
    var _gameStarted = false;
    
    function addClient(aClient)
    {
        _clients.push(aClient);        
        if(_clients.length === _maxPlayers)
        {
            _allConnected = true;             
            startGame();
        }
    }   
    
    function startGame()
    {
       
        _gameStarted = true;
        _currentClient = 0;   
        var unitCount = calculateUnitBonus(_clients[_currentClient]);
        _clients[_currentClient].setUnitCount(unitCount);      
   
        if(_clients[_currentClient].getType() ==="bot")
        {
               
        }
        else
        {         
            var msg = {
                unitCount: unitCount,
                info: "changeToPlacing"
            };
            msg = JSON.stringify(msg);
            var data = "event:changeToPlacing\ndata:" + msg + "\n\n";
            _clients[_currentClient].getResponseObject().write(data);
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
    
    
    function validateAttackingMove(move)
    {
        if (typeof move !== 'object')
            return false;

        if (move.type !== 'attack')
            return false;

        var attacker = move.from;
        var defender = move.to;
        
        //attacker tests
        
        if (_clients[_currentClient].getName() !== attacker.player)
            return false;
        if (!_map.hasContinent(attacker.continent))
            return false;
        if (!_map.getContinent(attacker.continent).hasCountryByName(attacker.country))
            return false;
        if (_map.getContinent(attacker.continent).getCountry(attacker.country).getOwner().getName() !== attacker.player)
            return false;

        //defender tests
        if (!_map.hasContinent(defender.continent))
            return false;
        if (!_map.getContinent(defender.continent).hasCountryByName(defender.country))
            return false;
        if (_map.getContinent(defender.continent).getCountry(defender.country).getOwner().getName() !== defender.player)
            return false;

        //border tests
        var attackerCountry = _map.getContinent(attacker.continent).getCountry(attacker.country);
        var defenderCountry = _map.getContinent(defender.continent).getCountry(defender.country);

        if (!(attackerCountry.borders(defenderCountry) && defenderCountry.borders(attackerCountry)))
            return false;
        
        // if passed till here move is Valid
        return true;
        
    }
    
    function validatePlacingMove(move)
    {      
        if(typeof move !== 'object') 
            return false;
        
        if(move.type !== 'placing') 
            return false;
        
        if (_clients[_currentClient].getName() !== move.player) 
            return false;
        
        if(move.unitCount > _clients[_currentClient].unitCount) 
            return false;
        
        if (!_map.hasContinent(move.continent))
            return false;
   
        if (!_map.getContinent(move.continent).hasCountryByName(move.country))
            return false;
  
        if (_map.getContinent(move.continent).getCountry(move.country).getOwner().getName() !== move.player)
            return false;
        
        // if passed till here move is Valid
        return true;
    }
    
    function calculateUnitBonus(aPlayer)
    {        
        var unitBonus = 0;
        var playerContinents = _map.getContinentsByPlayer(aPlayer);
        
        for(var continent in playerContinents)
        {
    
            var countryCount = playerContinents[continent].getCountryCount();
            var playerCountries = playerContinents[continent].getCountriesByPlayer(aPlayer);
            var ownedCountries = Object.keys(playerCountries).length;
    
            if(countryCount === ownedCountries)unitBonus += playerContinents[continent].getUnitBonus();            
            unitBonus += Math.round(ownedCountries /3);

        }
        
        if(unitBonus <3) unitBonus = 3;
        return unitBonus;                
    }
    
    function playerMove(req, res)
    {
        if (req.session.token === _clients[_currentClient].getToken())
        {
            console.log(req.session.token);
            var type = req.body.type;
            var body = req.body;
            switch (type)
            {
                case 'endPhase':
                    res.status(200).send("OK");
                    if (body.phaseName === "placingState")
                    {
                        var data = "event:changeToAttacking\ndata:ChangeToAttacking\n\n";
                        _clients[_currentClient].getResponseObject().write(data);
                    }
                    else if (body.phaseName === "attackingState")
                    {

                        var data = "event:changeToWaiting\ndata:ChangeToWaiting\n\n";
                        _clients[_currentClient].getResponseObject().write(data);

                        // next Client
                        _currentClient++;


                        // start at first Client if lastClient ended his turn
                        if (_currentClient === _clients.length)
                            _currentClient = 0;

                        var msg = {
                            unitCount: 12,
                            info: "changeToPlacing"
                        };
                        msg = JSON.stringify(msg);
                        var data = "event:changeToPlacing\ndata:" + msg + "\n\n";
                        _clients[_currentClient].getResponseObject().write(data);
                    }
                    break;
                case 'placing':
                    if(validatePlacingMove(body))
                    {                        
                        res.status(200).send("Move is Valid");
                        var msg = {
                            type: body.type,
                            player: body.player,
                            change: {
                                continent: body.continent,
                                country: body.country,
                                unitCount: body.unitCount
                            }
                        };
                        msg = JSON.stringify(msg);
                        var data = "event:placeUnits\ndata:" + msg + "\n\n";
                        messageAllClients(data);
                    }
                    else                    
                         res.status(400).send("Move is not Valid");
              
                    break;
                case 'attack':
                    if (validateAttackingMove(body))
                    {
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
                        var data = "event:attackResult\ndata:" + msg + "\n\n";
                        messageAllClients(data);
                    }
                    else
                        res.status(400).send("move is notValid");
                    break;
                default:
                    res.status(400).send("400");
                    break;

            }
        }
        else
        {
            res.status(400).send("Not ur Turn");
        }
        
    }
    
    var messageAllClientsCalled = false;
    function messageAllClients(msg)
    {
        messageAllClientsCalled = true;
        for(var i = 0, count = _clients.length ; i < count; i++)
        {
            if(_clients[i].getType() === 'human')_clients[i].getResponseObject().write(msg);
        }      
    }

    
    //test
    Object.defineProperty(this, 'validatePlacingStub', {    
        get: function () {
            if(validatePlacingMove.called === undefined)
            {                
                validatePlacingMove = stubFn();            
                return validatePlacingMove;
            }
            else
                return validatePlacingMove;  
        }
    });    
    Object.defineProperty(this, 'validateAttackingStub', {    
        get: function () {
            if(validateAttackingMove.called === undefined)
            {                
                validateAttackingMove = stubFn();            
                return validateAttackingMove;
            }
            else
                return validateAttackingMove;  
        }
    });    
    
    Object.defineProperty(this, 'gameStarted', {
        get: function () {
            return _gameStarted;
        }
    });
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
    this.validateAttackingMove = validateAttackingMove;
    this.validatePlacingMove = validatePlacingMove;
    this.calculateUnitBonus = calculateUnitBonus;
    
    
    this.attack = attack;
    this.placeUnits = placeUnits;
    this.getUnitStockByPlayer = getUnitStockByPlayer;
    
}