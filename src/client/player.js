/* 
 * Source Code für Spieler
 */

tddjs.namespace("client").player = player;

function player()
{
 
    var countrys = {};
    var name = "";
    var id;
    var idIsSetted = false;
    var color = "#000000";
    
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
 
    function getColor()
    {
        return color;
    }
    
    function setColor(settedColor)
    {
        if(isHexaColor(settedColor))
        color = settedColor;
    }
    
    function isHexaColor(sNum)
    {
        return (typeof sNum === "string") && sNum.length === 6 
         && ! isNaN( parseInt(sNum, 16) );
    }
    
    function getId()
    {
        return id;
    }
    
    function setId(settedId)
    {
        if(isNaN(settedId))
            throw new TypeError("Id has to be a Number");
        if(idIsSetted)
            throw new Error("Cant set Id more than Once");
        id = settedId;
        idIsSetted = true;
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
    this.getColor = getColor;
    this.setColor = setColor;
    this.getId = getId;
    this.setId = setId;
};