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
        var message = JSON.stringify({player:player,type:'endPhase', 'phaseName':_currentState.toString()});            
        _toServerLogs.push(message);
        
        var ajax = tddjs.util.ajax;
        var options = {
            headers:{
                "Content-Type": "application/json"
            },
            data: message,
            onSucces: null,
            onFailure: null
        };
        ajax.post(_url, options);        
    }
    
    function makeMove(move)
    {
        if (_currentState.isMoveLegal(move))
        {   
            return true;
        }
        else
            return false;
    }
    
    
    // EventSource
    function establishConnection()
    {
        _eventSource = new EventSource(_url, true);
        addAllEventListner();
    }
    
    function addAllEventListner()
    {        
        addAllEventListnerCalled = true;
        
        _eventSource.addEventListner("changeToPlacing", changeToPlacingState);
        _eventSource.addEventListner("changeToAttacking", changeToAttackingState);
        _eventSource.addEventListner("changeToWaiting", changeToWaitingState);
        _eventSource.addEventListner("attackResult", attackResult);
        _eventSource.addEventListner("placeUnits", placeUnits);          
    }      
    
    
    // EventSource events
    function changeToPlacingState(e)
    {
        var data = JSON.parse(e.data);
        var unitCount = data.unitCount;
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.placingState(_map, unitCount);
    }
    function changeToAttackingState(e)
    {
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.attackingState(_map);
        
    }
    function changeToWaitingState(e)
    {
        _fromServerLogs.push(e);
        _currentState = new tddjs.client.waitingState(_map);
    }
    function attackResult(e)
    {
        _fromServerLogs.push(e);
        
    }
    
    function placeUnits(e)
    {
        _fromServerLogs.push(e);
        
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
 
}