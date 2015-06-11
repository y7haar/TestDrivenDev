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
    var _currentState = new tddjs.client.waitingState();
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
        _currentState = new tddjs.client.placingState();
    }
    function changeToAttackingState(e)
    {
        _currentState = new tddjs.client.attackingState();
        
    }
    function changeToWaitingState(e)
    {
        _currentState = new tddjs.client.waitingState();
    }
    function attackResult(e)
    {
        
    }
    
    function placeUnits(e)
    {
        
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
    
    
    
    this.establishConnection = establishConnection;
    this.getUrl = getUrl;
    this.getMap = getMap;
    this.getPlayer = getPlayer;
    this.getStateName = getStateName;
 
}