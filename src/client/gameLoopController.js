/* 
 * GameLogic implemeted with the statepattern. 
 */


tddjs.namespace("client.game").gameLoopController = gameLoopController;

function gameLoopController()
{
    var _player;
    var _map;
    
    function setMap(aMap)
    {
        if(!(aMap instanceof tddjs.client.Map))
            throw new TypeError("Parameter ist not instance of Map");
        this._map = aMap;
    }
    
    function getMap()
    {
        return _map;
    }
    
    function setPlayer(aPlayer)
    {
        if(!(aPlayer instanceof tddjs.client.Player))
            throw new TypeError("Parameter ist not instance of Player");
        this._player = aPlayer;
    }
    
    function getPlayer()
    {
        return this._player;
    }    

    function isAttackPossible(country1,country2)
    {
        if(!(oountry1 instanceof tddjs.client.map.country))
            throw new TypeError("Parameter1 ist not instance of Country");
        else if(!(oountry2 instanceof tddjs.client.map.country))
            throw new TypeError("Parameter2 ist not instance of Country");
        
        if(country1.borders(country2) && country2.borders(country1)) return true;
        
        else return false;
    }
   
    this.setMap = setMap;
    this.getMap = getMap;
    this.setPlayer = setPlayer;
    this.getPlayer = getPlayer;
    this.isAttackPossible = isAttackPossible;
    
}