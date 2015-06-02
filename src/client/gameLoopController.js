/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client").gameLoopController = gameLoopController;

function gameLoopController()
{
    var _player;
    var _map;
    
    function setMap(aMap)
    {
        if(!(aMap instanceof tddjs.client.map.map))
            throw new TypeError("Parameter ist not instance of Map");
        this._map = aMap;
    }
    
    function getMap()
    {
        return _map;
    }
    
    function setPlayer(aPlayer)
    {
        if(!(aPlayer instanceof tddjs.client.player))
            throw new TypeError("Parameter ist not instance of Player");
        this._player = aPlayer;
    }
    
    function getPlayer()
    {
        return this._player;
    }    

    this.setMap = setMap;
    this.getMap = getMap;
    this.setPlayer = setPlayer;
    this.getPlayer = getPlayer;    
}