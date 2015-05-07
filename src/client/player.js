/* 
 * Source Code für Spieler
 */
(function(){
 
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
    
    function hasCountry(searchedCountry)
    {
        if(typeof(searchedCountry) !== "Country")
            throw new TypeError("searched Object is not a Country");
    }
    
    function addCountry(addedCountry)
    {
        if(typeof(addedCountry) !== "Country")
            throw new TypeError("adden Object is not a Country");
    }
 
    tddjs.namespace("client").Player = {
        getName: getName,
        setName: setName,
        hasCountry: hasCountry,
        addCountry: addCountry
    };
}());

