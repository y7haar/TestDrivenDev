/* 
Source-Code for Continent
 */


(function()
{
    var _Country = [];
    
    function addCountry(aCountry)
    {
      _Country.push(aCountry);
    }
    
    function getCountryCount()
    {
       return _Country.length;
    }
    
    function hasCountry(aCountry)
    {
       return false;
    }
    
    function getCountrys()
    {
        return _Country;
    }
    
    tddjs.namespace("client.map").Continent = {
        addCountry: addCountry,
        getCountryCount: getCountryCount,
        getCountrys: getCountrys,
        hasCountry: hasCountry
    };    
}());