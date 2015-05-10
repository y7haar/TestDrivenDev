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
        if(typeof(newName) != "string")
            throw new TypeError("Not a String");
        
        name = newName;
    }
    
    function hasCountryByObject(searchedCountry)
    {
        if(! (searchedCountry instanceof tddjs.client.map.country))
            throw new TypeError("searched Object is not a Country");
        return false;
    }
    
    function hasCountryByName(countryName)
    {
        if(! (countryName instanceof string))
            throw new TypeError("searched Name is not a String");
        return false;
    }
    
    function addCountry(addedCountry)
    {
        if(! (addedCountry instanceof tddjs.client.map.country))
            throw new TypeError("added Object is not a Country");
    }
    
    function removeCountry(removedCountry)
    {
        if(! (removedCountry instanceof tddjs.client.map.country))
            throw new TypeError("removed Object is not a Country");
    }
    
    function getCountryCount()
    {
        return 0;
    }
 
  
    this.getName = getName;
    this.setName = setName;
    this.hasCountryByObject = hasCountryByObject;
    this.hasCountryByName = hasCountryByName;
    this.addCountry = addCountry;
    this.removeCountry = removeCountry;
    this.getCountryCount = getCountryCount;
 
};

