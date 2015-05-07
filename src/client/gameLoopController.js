/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client.game").gameLoopController = gameLoopController;

function gameLoopController()
{
    var _players = [];
    var _map;
    
    function setMap(aMap)
    {
        if(aMap instanceof tddjs.client.Map)
            throw new TypeError("Parameter ist not instance of Map");
        this._map = aMap;
    }
    
    function getMap()
    {
        return _map;
    }
    
    function addPlayer(aPlayer)
    {
        if(aPlayer instanceof tddjs.client.Player)
            throw new TyperError("Parameter ist not instance of Player");
        this._player.push(aPlayer);
    }
    
    function getPlayers()
    {
        return this._players;
    }
    
    
    this.setMap = setMap;
    this.getMap = getMap;
    this.addPlayer = addPlayer;
    this.getPlayers = getPlayers;
}