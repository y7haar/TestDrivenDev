/* 
 * Sourcecode für Karte
 */

tddjs.namespace("client.map").map = map;

function map()
{
    var _continents = {};
    
    function addContinent(aContinent)
    {
        if(!(aContinent instanceof tddjs.client.map.continent))
            throw new TypeError("Parameter ist not instance of Continent");
        _continents[aContinent.getName()] = aContinent;
    }
    
    function hasContinent(aContinentName)
    {
        if(Object.keys(_continents).indexOf(aContinentName) >= 0)
            return true;
        else return false;
    }
    
    function getContinents()
    {
        return _continents;
    }
    
    function getContinentCount()
    {
        return 0;
    }
    
    this.addContinent = addContinent;
    this.hasContinent = hasContinent;
    this.getContinents = getContinents;
    this.getContinentCount = getContinentCount;
}
    


