/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client").gameLoopController = gameLoopController;

function gameLoopController(aMap, aPlayer, aUrl)
{
    //init
    setMap(aMap);
    setPlayer(aPlayer);
    setUrl(aUrl);
    // initEnd 
    
    var _player;
    var _map;
    var _url;
    var _currentState = new tddjs.client.waitingState(_map);
    var _eventSource = null;
    var _fromServerLogs = [];
    var _toServerLogs =[];
    
    var _gameController = null;
  
    function setUrl(aUrl)
    {
        if(typeof aUrl !== 'string')
            throw new TypeError("Url ist not a valid Url-String");
        _url = aUrl;
    }
    
    function getUrl()
    {
        return _url;
    }
    
    function setMap(aMap)
    {
        if(!(aMap instanceof tddjs.client.map.map))
            throw new TypeError("Map ist not instance of Map");
        _map = aMap;
    }
    
    function getMap()
    {
        return _map;
    }
    
    function setPlayer(aPlayer)
    {
        if(!(aPlayer instanceof tddjs.client.player))
            throw new TypeError("Player ist not instance of Player");
        _player = aPlayer;
    }
    
    function getPlayer()
    {
        return _player;
    }
    
    function getStateName()
    {
        return _currentState.toString();
    }
    
    function endPhase()
    {
        var player = JSON.parse(_player.serialize());
        var message = {player:player,type:'endPhase', phaseName:_currentState.toString()};           
        var ajax = tddjs.util.ajax;
        var options = {
            headers:{
                "Content-Type": "application/json"
            },
            data: JSON.stringify(message),
            onSuccess: writeToLogs,
            onFailure: null
        };
        ajax.post(_url, options);   
        
        function writeToLogs()
        {
            _toServerLogs.push(message);
        }
    }
    
    function makeMove(move)
    {
       
        if (_currentState.isMoveLegal(move))
        {   
            //console.log("MOVE:\n");
            //console.dir(move);
            var ajax = tddjs.util.ajax; 
            var options = {
              headers:{
                  "Content-Type": "application/json"
              },
              data: JSON.stringify(move),
              onSuccess: writeToLogs,
              onFailure: null
            };
            ajax.post(_url, options);           
            return true;
        }
        else
            return false;           
     
        function writeToLogs()
        {
            _toServerLogs.push(move);
        }
        
    }
    
    
    // EventSource
    function establishConnection()
    {
        _eventSource = new EventSource(_url, {withCredentials:true});
        addAllEventListner();
        console.log(_eventSource);
        console.log(_toServerLogs);
    }
    
    function addAllEventListner()
    {        
        addAllEventListnerCalled = true;
       
        _eventSource.addEventListener("changeToPlacing", changeToPlacingState);
        _eventSource.addEventListener("changeToAttacking", changeToAttackingState);
        _eventSource.addEventListener("changeToWaiting", changeToWaitingState);
        _eventSource.addEventListener("attackResult", attackResult);
        _eventSource.addEventListener("placeUnits", placeUnits);
    }      
    
    
    // EventSource events
    function changeToPlacingState(e)
    {           
        var data = JSON.parse(e.data);     
        var unitCount = data.unitCount;
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.placingState(_map, unitCount);
        _gameController.update({
            type:"placing",
        unitCount: data.unitCount
        });
        
    }
    function changeToAttackingState(e)
    {        
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.attackingState(_map);
        _gameController.update();
    }
    function changeToWaitingState(e)
    {
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.waitingState(_map);
        _gameController.update();
      
    }
    function attackResult(e)
    {
        _fromServerLogs.push(e);
        var data = JSON.parse(e.data);
        
        console.log("------------------- SHOWDOWN --------------------");
        console.log(data.attacker.player+" attacked "+ data.defender.player);
        console.log("OUTCOME: ");
        console.log("   "+data.attacker.player+": "+data.attacker.outcome);
        console.log("   "+data.defender.player+": "+data.defender.outcome);
        console.log("-------------------------------------------------\n\n");
        
        var changes1 = data.changes[0];
        var changes2 = data.changes[1];
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
        
        _gameController.update();
    }
    
    function placeUnits(e)
    {
        _fromServerLogs.push(e);
        var data = JSON.parse(e.data);
        
        console.log("-------------------------------------------------");
        console.log( _map.getContinent(data.change.continent).getCountry(data.change.country).getOwner().getName()+
                " placed "+ data.change.unitCount+"-Units to "+data.change.country);
        console.log("-------------------------------------------------\n\n");
        _map.getContinent(data.change.continent).getCountry(data.change.country).setUnitCount(data.change.unitCount);
        
        _gameController.update();
    }
    
    function setGameController(aController)
    {
        if(! (aController instanceof tddjs.client.controller.gameController) )
            throw new TypeError("Expectet instance of gameController got " + typeof aController);
        _gameController = aController;
    }
    
    //  Testing
    Object.defineProperty(this, 'eventSource', {
        get: function () {
            return _eventSource;
        }
    });
    
    var addAllEventListnerCalled = false;
    Object.defineProperty(this, 'isAddAllEventListnerCalled', {
        get: function () {
            return addAllEventListnerCalled;
        }
    });
    
    Object.defineProperty(this, 'gameController', {
        get: function () {
            return _gameController;
        }
    });
    Object.defineProperty(this, 'currentState', {
        get: function () {
            return _currentState;
        }
    });
    
    Object.defineProperty(this, 'fromServerLogs', {
        get: function () {          
            return _fromServerLogs;
        }
    });
    Object.defineProperty(this, 'toServerLogs', {
        get: function () {
            return _toServerLogs;
        }
    });
    
    this.makeMove = makeMove;
    this.endPhase = endPhase;
    this.establishConnection = establishConnection;
    this.getUrl = getUrl;
    this.getMap = getMap;
    this.getPlayer = getPlayer;
    this.getStateName = getStateName;
    this.setGameController = setGameController;
 
}