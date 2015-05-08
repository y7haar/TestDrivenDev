/* 
Source-Code for Continent
 */

tddjs.namespace("client.map").continent = continent;

function continent()
{
    var _country = [];
    var _unitBonus;
    
    function setUnitBonus(number)
    {
        if(isNaN(number))
            throw new TypeError("Parameter ist not a Number.");
        else if ( number < 0)
            throw new Error("Parameter is < then 0 ");
        
        _unitBonus = number;
    }
    
    function getUnitBonus()
    {
      
        
        return _unitBonus;
    }

    function addCountry(aCountry)
    {
        if(!(aCountry instanceof tddjs.client.map.country))
            throw new TypeError("Parameter ist not instance of Country");
        
        _country.push(aCountry);
    }

    function getCountryCount()
    {
        return _country.length;
    }

    function hasCountry(aCountry)
    {
        if(_country.indexOf(aCountry) >= 0)
            return true;
        else return false;
    }

    function getCountrys()
    {
        return _country;
    }
    
    
    this.setUnitBonus = setUnitBonus;
    this.getUnitBonus = getUnitBonus;

    this.addCountry = addCountry;
    this.getCountryCount = getCountryCount;
    this.getCountrys = getCountrys;
    this.hasCountry = hasCountry;
  
};