/* 
 * Sourcecode für Karte
 */

tddjs.namespace("client.map").map = map;

function map()
{
    var _continents = {};
    
    function addContinent(aContinent)
    {
        _continents[aContinent.getName()] = aContinent;
    }
    
    function hasContinent(aContinent)
    {
        
    }
    
    function getContinents()
    {
        return _continents;
    }
    
    this.addContinent = addContinent;
    this.hasContinent = hasContinent;
    this.getContinents = getContinents;
  
}
    


