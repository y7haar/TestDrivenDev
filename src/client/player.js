/* 
 * Source Code für Spieler
 */

tddjs.namespace("client").player = player;

function player(){
 
    var countrys = {};
    var name = "";
    
    function getName()
    {
       return name; 
    }
    
    function setName(newName)
    {
        if(typeof(newName) !== "string")
            throw new TypeError("Not a String");
        
        name = newName;
    }
    
    function hasCountryByObject(searchedCountry)
    {
        if(! (searchedCountry instanceof tddjs.client.map.country))
            throw new TypeError("searched Object is not a Country");
        
        if (typeof countrys[searchedCountry.getName()] !== "undefined" )
            return true;
        else
            return false;
    }
    
    function hasCountryByName(countryName)
    {
        if(typeof countryName !== "string")
            throw new TypeError("searched Name is not a String");
        
        if(typeof countrys[countryName] !== "undefined")
            return true;
        else return false;
    }
    
    function addCountry(addedCountry)
    {
        if(! (addedCountry instanceof tddjs.client.map.country))
            throw new TypeError("added Object is not a Country");
        var countryName = addedCountry.getName();
        countrys[countryName] = addedCountry;
    }
    
    function removeCountry(removedCountry)
    {
        if(! (removedCountry instanceof tddjs.client.map.country))
            throw new TypeError("removed Object is not a Country");
        
        var countryName = removedCountry.getName();
        delete countrys[countryName];
    }
    
    function getCountryCount()
    {
        return Object.keys(countrys).length;
    }
    
    function getCountry(countryName)
    {
        if(hasCountryByName(countryName))
            return countrys[countryName];
        else return null;
    }
    
    function getCountrys()
    {
        return countrys;
    }
 
  
    this.getName = getName;
    this.setName = setName;
    this.hasCountryByObject = hasCountryByObject;
    this.hasCountryByName = hasCountryByName;
    this.addCountry = addCountry;
    this.removeCountry = removeCountry;
    this.getCountryCount = getCountryCount;
    this.getCountry = getCountry;
    this.getCountrys = getCountrys;
 
};

