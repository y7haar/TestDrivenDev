/* 
Source-Code for Continent
 */

tddjs.namespace("client.map").continent = continent;

function continent()
{
    var _country = [];

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
        return false;
    }

    function getCountrys()
    {
        return _country;
    }


    this.addCountry = addCountry;
    this.getCountryCount = getCountryCount;
    this.getCountrys = getCountrys;
    this.hasCountry = hasCountry;
  
};