/* 
Source-Code for AI 
 */
if(typeof module !== "undefined")
{
    module.exports = randomAi;
}
else
    tddjs.namespace("server.controller").randomAi = randomAi;

function randomAi(aPlayer, aMap, aGlc)
{
    var _player = aPlayer;
    var _map = aMap;
    var _gameLoopController = aGlc;
    
    var _self = this;
    
    function evaluateAttack(aFrom, aTo)
    {
        return aFrom.getUnitCount() / aTo.getUnitCount();
    }
    
    function evaluatePlacing(aCountry)
    {
        var borderCountries = aCountry.getBorders();
        var sum = 0;
        
        for(var i = 0;i < borderCountries.length;++i)
        {
            if(borderCountries[i].getOwner() !== _player)
                sum += borderCountries[i].getUnitCount() / aCountry.getUnitCount();
        }
        
        return sum;
    }
    
    function placeUnits(aCountry, aCount)
    {
        
    }
    
    function placeAllUnits()
    {
        var continents = _map.getContinentsByPlayer(_player);
        var unitStock = _gameLoopController.getUnitStockByPlayer(_player);
        
        var countryValues = [];
        var valueSum = 0;
        
        for (var continent in continents) 
        {
            if (continents.hasOwnProperty(continent)) 
            {
                var countries = continents[continent].getCountriesByPlayer(_player);
                
                
                for(var country in countries)
                {
                    if(countries.hasOwnProperty(country))
                    {
                        
                        var value = _self.evaluatePlacing(countries[country]);
                        
                        valueSum += value;
                        
                        var obj = {};
                        obj.value = value;
                        obj.country = country;
                        
                        countryValues.push(obj);
                    }
                }
            }
        }
        
        var maxValue = 0;
        var maxValueCountry;
        var unitsLeft = unitStock;
        
        for(var i = 0;i < countryValues.length && unitsLeft > 0;++i)
        {
            var unitPercentage = countryValues[i].value / valueSum;
            var units = parseInt(unitPercentage * unitStock);
            
            _self.placeUnits(countryValues[i].country, units);
            
            unitsLeft -= units;
            
            if(countryValues[i].value > maxValue)
            {
                maxValue = countryValues[i].value;
                maxValueCountry = countryValues[i].country;
            }
        }
        
        _self.placeUnits(maxValueCountry, unitsLeft);
    }
    
    this.evaluateAttack = evaluateAttack;
    this.evaluatePlacing = evaluatePlacing;
    this.placeUnits = placeUnits;
    this.placeAllUnits = placeAllUnits;
};


