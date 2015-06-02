/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client").gameLoopController = gameLoopController;

function gameLoopController()
{
    var _player;
    var _map;
    var _currentState = new tddjs.client.waitingState();
    
    function setMap(aMap)
    {
        if(!(aMap instanceof tddjs.client.map.map))
            throw new TypeError("Parameter ist not instance of Map");
        _map = aMap;
    }
    
    function getMap()
    {
        return _map;
    }
    
    function setPlayer(aPlayer)
    {
        if(!(aPlayer instanceof tddjs.client.player))
            throw new TypeError("Parameter ist not instance of Player");
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
    
    function isMoveLegal()
    {
    }

    this.setMap = setMap;
    this.getMap = getMap;
    this.setPlayer = setPlayer;
    this.getPlayer = getPlayer;    
    this.getStateName = getStateName;
    this.isMoveLegal = isMoveLegal;
}