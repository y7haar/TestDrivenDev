/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client").gameLoopController = gameLoopController;

function gameLoopController(aMap, aPlayer, aUrl)
{
    setMap(aMap);
    setPlayer(aPlayer);
    setUrl(aUrl);
    
    
    var _player;
    var _map;
    var _url;
    var _currentState = new tddjs.client.waitingState();
  
    
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
    
    function isMoveLegal()
    {
    }
    
    this.getUrl = getUrl;
    this.getMap = getMap;
    this.getPlayer = getPlayer;    
    this.getStateName = getStateName;
    this.isMoveLegal = isMoveLegal;
}