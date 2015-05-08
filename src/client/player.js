/* 
 * Source Code für Spieler
 */

tddjs.namespace("client").player = player;

function player(){
 
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
    
    function hasCountry(searchedCountry)
    {
        if(typeof(searchedCountry) != "Country")
            throw new TypeError("searched Object is not a Country");
    }
    
    function addCountry(addedCountry)
    {
        if(typeof(addedCountry) != "Country")
            throw new TypeError("added Object is not a Country");
    }
    
    function removeCountry(removedCountry)
    {
        if(typeof(removedCountry) != "Country")
            throw new TypeError("removed Object is not a Country");
    }
    
    function getCountryCount()
    {
        
    }
 
  
        this.getName = getName;
        this.setName= setName;
        this.hasCountry = hasCountry;
        this.addCountry = addCountry;
        this.removeCountry = removeCountry;
        this.getCountryCount = getCountryCount;
 
};

