/* 
 * Sourcecode für Karte
 */
if(typeof module !== "undefined")
{
    module.exports = map;
}
else
    tddjs.namespace("server.map").map = map;

function map()
{
    var _continents = {};
    
    //Grind möglicherweise benötigt zum anzeigen [][] country
    function addContinent(aContinent)
    {
        if(!(isContinent(aContinent)))
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
    function getContinent(continentName)
    {
        if(hasContinent(continentName))
            return _continents[continentName];
        
    }
    
    function getContinentCount()
    {
        return Object.keys(_continents).length;;
    }
    
    function isContinent(continent)
    {
        if(typeof continent.getName === "undefined")
            return false;
        
        if(typeof continent.getUnitBonus === "undefined")
            return false;
        
        if(typeof continent.getCountry === "undefined")
            return false;
        
        return true;
    }
    
    this.addContinent = addContinent;
    this.hasContinent = hasContinent;
    this.getContinents = getContinents;
    this.getContinentCount = getContinentCount;
    this.getContinent = getContinent;
}
    





