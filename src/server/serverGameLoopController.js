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
    var _self = this;
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
               var ai = new randomAi(_clients[_currentClient], _map, _self);
               ai.placeAllUnits();
               ai.attackAll();
               _currentClient++;
               triggerNextPlayer();
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
    
    function triggerNextPlayer()
    {
        if (_currentClient >=_clients.length)
         _currentClient = 0;    
                        
        if (_clients.length === 1 && _clients[_currentClient].getType() === "human")
        {
            console.log("Player " + _clients[_currentClient].getName() + " won.");
            var data = "event:close\ndata:You Won\n\n";
            _clients[_currentClient].getResponseObject().write(data);
        }
        else if (Object.keys(_map.getContinentsByPlayer(_clients[_currentClient])).length === 0)
        {
            console.log("Player " + _clients[_currentClient].getName() + " lost.");
            var data = "event:close\ndata:You Lost\n\n";
            
            if(_clients[_currentClient].getType() === "human")
                _clients[_currentClient].getResponseObject().write(data);
            
            _clients.splice(_currentClient, _currentClient + 1);
            triggerNextPlayer();
        }
        else {

            var unitCount = calculateUnitBonus(_clients[_currentClient]);
            _clients[_currentClient].setUnitCount(unitCount);

            if (_clients[_currentClient].getType() === "bot")
            {
                var ai = new randomAi(_clients[_currentClient], _map, _self);
                ai.placeAllUnits();
                ai.attackAll();
                _currentClient++;
                triggerNextPlayer();
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
        console.log("COUNTRY");
        console.log(aCountry);
        
        var continents = _map.getContinents();        
        var fromContinent;     
           
        for(var continent in continents)
        {
            if(continents[continent].hasCountryByObject(aCountry))            
                fromContinent = continent;
        }
      
        
        var placingMove = {
            type: 'placing',
            unitCount: aCount,
            player: aCountry.getOwner().getName(),
            continent: fromContinent,
            country: aCountry.getName()
        };
        
        var result = calcPlacingResult(placingMove);
        applyPlacingResult(result);
        console.log(result);
        msg = JSON.stringify(result);
        var data = "event:placeUnits\ndata:" + msg + "\n\n";
        messageAllClients(data);
    }
    
    // Method should return count of new units when a new round is started
    // It should also include Continent Bonus if player owns whole contintent
    function getUnitStockByPlayer(aPlayer)
    {
        var index  = _clients.indexOf(aPlayer);
        return _clients[index].unitCount;        
    }
    
    // This method should update map with battle result of two countries
    //No Validation is needed
    function attack(aFrom, aTo)
    {
        var continents = _map.getContinents();
        
        var fromContinent;
        var toContinent;
       
        for(var continent in continents)
        {
            if(continents[continent].hasCountryByObject(aFrom))
            {
                fromContinent = continent;
            }
            if(continents[continent].hasCountryByObject(aTo))
            {
                toContinent = continent;
            }
        }
        
        var attackMove = {
            type: 'attack',
            from: {
                player: aFrom.getOwner().getName(),
                continent: fromContinent,
                country: aFrom.getName()
            },
            to: {
                player: aTo.getOwner().getName(),
                continent: toContinent,
                country: aTo.getName()
            }
        };
        
        var result = calcAttackResult(attackMove);
        applyAttackResult(result);
        
        var msg = JSON.stringify(result);
        var data = "event:attackResult\ndata:" + msg + "\n\n";
        messageAllClients(data);
        
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
                        
                        console.log("###########################");
                        console.log(_map.getContinentsByPlayer({}));

                        // start at first Client if lastClient ended his turn
                        if (_currentClient === _clients.length)
                            _currentClient = 0;

                        if(_clients.length === 1)
                        {
                            console.log("Player "+_clients[_currentClient].getName()+" won.");
                            var data = "event:close\ndata:You Won\n\n";
                            _clients[_currentClient].getResponseObject().write(data);
                        }
                        else if(Object.keys(_map.getContinentsByPlayer(_clients[_currentClient])).length === 0)
                        {            
                            console.log("Player "+_clients[_currentClient].getName()+" lost.");
                            var data = "event:close\ndata:You Lost\n\n";
                            _clients[_currentClient].getResponseObject().write(data);
                            _clients.splice(_currentClient, _currentClient+1);
                            triggerNextPlayer();
                        }
                        else {
         
                            var unitCount = calculateUnitBonus(_clients[_currentClient]);
                            _clients[_currentClient].setUnitCount(unitCount);

                            if (_clients[_currentClient].getType() === "bot")
                            {
                                var ai = new randomAi(_clients[_currentClient], _map, _self);
                                ai.placeAllUnits();
                                ai.attackAll();
                                _currentClient++;
                                triggerNextPlayer();
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
                    }
                    break;
                case 'placing':
                    if(validatePlacingMove(body))
                    {                        
                        res.status(200).send("Move is Valid");
                        var msg = calcPlacingResult(body);
                        applyPlacingResult(msg);
                        
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
                        var msg = calcAttackResult(body);
                        applyAttackResult(msg);
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
    
    function calcAttackResult(move)
    {        
        var attackerUnitCount = _map.getContinent(move.from.continent).getCountry(move.from.country).getUnitCount() -1;
        var defenderUnitCount = _map.getContinent(move.to.continent).getCountry(move.to.country).getUnitCount();
        
        var attackerDiceResults = [];
        var defenderDiceResults = [];
        
        for(var i = 0; i<attackerUnitCount; i++)
        {
            attackerDiceResults.push(Math.floor((Math.random() * (6 - 0)) + 0));
        }
        
        for(var i = 0; i<defenderUnitCount; i++)
        {
            defenderDiceResults.push(Math.floor((Math.random() * (6 - 0)) + 0));
        }
        
        function sortNumber(a, b) {
            return b - a;
        }
        
        attackerDiceResults.sort(sortNumber);
        defenderDiceResults.sort(sortNumber);
        
        console.log(attackerDiceResults.sort(sortNumber));
        console.log(defenderDiceResults.sort(sortNumber));
        
        var attackerLoses = 0;
        var defenderLoses = 0;
        
        if(attackerUnitCount >= defenderUnitCount)
        {
            for(var i = 0; i <defenderUnitCount;i++)
            {
                if(attackerDiceResults[i] > defenderDiceResults[i])defenderLoses++;
                else attackerLoses++;
            }
        }
        else
        {
            for(var i = 0; i <attackerUnitCount;i++)
            {
                if(attackerDiceResults[i] > defenderDiceResults[i])defenderLoses++;
                else attackerLoses++;
            }
        }
        
        console.log("a lost: "+attackerLoses);
        console.log("d lost: "+defenderLoses);
        
        var newAttackerUnitCount = attackerUnitCount - attackerLoses +1;
        var newDefenderUnitCount = defenderUnitCount - defenderLoses;
        
        var attackerOutcome;
        var defenderOutcome;
        
        var attackerChanges;
        var defenderChanges;
        
        if(newDefenderUnitCount === 0)
        {
            attackerOutcome = "winner";
            defenderOutcome = "loser";
            
            attackerChanges = {
                continent: move.from.continent,
                country: move.from.country,
                owner: move.from.player,
                unitCount: 1
            };
            
            defenderChanges = {
                continent: move.to.continent,
                country: move.to.country,
                owner: move.from.player,
                unitCount: newAttackerUnitCount -1
            };
            
        }
        else
        {
            attackerOutcome = "loser";
            defenderOutcome = "winner";
            
            attackerChanges = {
                continent: move.from.continent,
                country: move.from.country,
                owner: move.from.player,
                unitCount: newAttackerUnitCount
            };
            
            defenderChanges = {
                continent: move.to.continent,
                country: move.to.country,
                owner: move.to.player,
                unitCount: newDefenderUnitCount
            };
        }
        
        
        var result = {
            type:"attacking",
            attacker:{
                player:move.from.player,
                outcome:attackerOutcome
            },
            defender:{
                player:move.to.player,
                outcome:defenderOutcome
            },
            changes:[attackerChanges, defenderChanges]
        };        
      
        console.log("AtackResult: \n");
        console.dir(result);
        return result;
    }
    function calcPlacingResult(move)
    {
        var newUnitCount = _map.getContinent(move.continent).getCountry(move.country).getUnitCount()+ move.unitCount;
        var result = {
            type: move.type,
            player: move.player,
            change: {
                continent: move.continent,
                country: move.country,
                unitCount: newUnitCount
            }
        };
        
        return result;
    }
    
    function applyAttackResult(move)
    {
        var changes1 = move.changes[0];
        var changes2 = move.changes[1];
        var players = {};
        var player1Name = _map.getContinent(changes1.continent).getCountry(changes1.country).getOwner().getName();
        var player2Name = _map.getContinent(changes2.continent).getCountry(changes2.country).getOwner().getName();
        
        players[player1Name] = _map.getContinent(changes1.continent).getCountry(changes1.country).getOwner();
        players[player2Name] = _map.getContinent(changes2.continent).getCountry(changes2.country).getOwner();
 
       
       //changes 1
        _map.getContinent(changes1.continent).getCountry(changes1.country).setUnitCount(changes1.unitCount);
        _map.getContinent(changes1.continent).getCountry(changes1.country).setOwner(players[changes1.owner]);        
        //changes 2
        _map.getContinent(changes2.continent).getCountry(changes2.country).setUnitCount(changes2.unitCount);
        _map.getContinent(changes2.continent).getCountry(changes2.country).setOwner(players[changes2.owner]); 
    }
    
    function applyPlacingResult(move)
    {
         _map.getContinent(move.change.continent).getCountry(move.change.country).setUnitCount(move.change.unitCount);
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
    this.calcAttackResult = calcAttackResult;
    this.calcPlacingResult = calcPlacingResult;
    this.applyAttackResult = applyAttackResult;
    this.applyPlacingResult = applyPlacingResult;
    
    
    this.attack = attack;
    this.placeUnits = placeUnits;
    this.getUnitStockByPlayer = getUnitStockByPlayer;
    
}