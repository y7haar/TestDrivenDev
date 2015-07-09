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
    var _instantAttackValue = 2.5;
    var _attackWorthy = 1.5;
    
    function evaluateAttack(aFrom, aTo)
    {
        return (aFrom.getUnitCount() - 1) / aTo.getUnitCount();
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
        _gameLoopController.placeUnits(aCountry, aCount);
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
                        obj.country = countries[country];
                        
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
            
            if(units > 0)
                _self.placeUnits(countryValues[i].country, units);
            
            unitsLeft -= units;
            
            if(countryValues[i].value > maxValue)
            {
                maxValue = countryValues[i].value;
                maxValueCountry = countryValues[i].country;
            }
        }
        
        if(unitsLeft > 0)
            _self.placeUnits(maxValueCountry, unitsLeft);
    }
    
    function attack()
    {
        var continents = _map.getContinentsByPlayer(_player);
        var maxValue = 0;
        var bestFrom, bestTo;
        
        for (var continent in continents) 
        {
            if (continents.hasOwnProperty(continent)) 
            {
                var countries = continents[continent].getCountriesByPlayer(_player);
                
                for(var country in countries)
                {
                    if(countries.hasOwnProperty(country))
                    {
                        // Evaluate all enemy borders
                        var borders = countries[country].getBorders();
                        
                        for(var i = 0;i < borders.length;++i)
                        {
                            // Enemy border
                            if(borders[i].getOwner() !== _player)
                            {
                                var value = _self.evaluateAttack(countries[country], borders[i]);
                                
                                if(value >= _instantAttackValue)
                                {
                                    _gameLoopController.attack(countries[country], borders[i]);
                                    return true;
                                }
                                
                                if(value > maxValue)
                                {
                                    maxValue = value;
                                    bestFrom = countries[country];
                                    bestTo = borders[i];
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // check if attack is worth
        if(maxValue >= _attackWorthy)
        {
            _gameLoopController.attack(bestFrom, bestTo);
            return true;
        }
        
        return false;
    }
    
    function attackAll()
    {
        var attacksWorth = true;
        
        while(attacksWorth)
        {
            attacksWorth = _self.attack();
        }
    }
    
    this.evaluateAttack = evaluateAttack;
    this.evaluatePlacing = evaluatePlacing;
    this.placeUnits = placeUnits;
    this.placeAllUnits = placeAllUnits;
    this.attack = attack;
    this.attackAll = attackAll;
};


