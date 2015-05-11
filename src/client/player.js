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
        if(typeof settedColor !== "string")
            throw new TypeError("Setted Color is not a String");
        
        if(settedColor.charAt(0) !== '#')
            throw new Error("Color doesnt start with a #");
        
        if(settedColor.length !== 7)
            throw new Error("Color not long enough");
        
        if(settedColor.match(/^#[\da-f]{3}([\da-f]{3}|)$/i))
            color = settedColor;
        else
            throw new Error("This is not a valid Hexa-Color");
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
    
    function serialize()
    {
        var id = getId();
        var name = getName();
        var color = getColor();
        
        var playerObject = {
            id: id,
            name: name,
            color: color
        };
        
        return JSON.stringify(playerObject);
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
    this.serialize = serialize;
};