/* 
 * Source Code für Spieler
 */
tddjs.namespace("client").player = player;

function player()
{
    //Länder des Spielers
    var countrys = {};
    
    //Werte
    var name = "";
    var id;
    var idIsSetted = false;
    var color = "#000000";
    var type = "human";
    
    //Holt den Namen
    function getName()
    {
       return name; 
    }
    
    //Setzt den Namen
    function setName(newName)
    {
        if(typeof(newName) !== "string")
            throw new TypeError("Not a String");
        
        name = newName;
    }
    
    //Überprüft anhand eines Objects ob der Spieler es besitzt
    function hasCountryByObject(searchedCountry)
    {
        if(! (searchedCountry instanceof tddjs.client.map.country))
            throw new TypeError("searched Object is not a Country");
        
        if (typeof countrys[searchedCountry.getName()] !== "undefined" )
            return true;
        else
            return false;
    }
    
    //Überprüft anhand eines Namens ob der Spieler es besitzt
    function hasCountryByName(countryName)
    {
        if(typeof countryName !== "string")
            throw new TypeError("searched Name is not a String");
        
        if(typeof countrys[countryName] !== "undefined")
            return true;
        else return false;
    }
   
    //Fügt ein Land hinzu
    function addCountry(addedCountry)
    {
        if(! (addedCountry instanceof tddjs.client.map.country))
            throw new TypeError("added Object is not a Country");
        
        var countryName = addedCountry.getName();
        countrys[countryName] = addedCountry;
    }
    
    //Entfernt ein Land
    function removeCountry(removedCountry)
    {
        if(! (removedCountry instanceof tddjs.client.map.country))
            throw new TypeError("removed Object is not a Country");
        
        var countryName = removedCountry.getName();
        delete countrys[countryName];
    }
    
    //Anzahl der Länder die der Spieler besitzt
    function getCountryCount()
    {
        return Object.keys(countrys).length;
    }
    
    //Holt Land anhand des Namens
    function getCountry(countryName)
    {
        if(hasCountryByName(countryName))
            return countrys[countryName];
        else return null;
    }
    
    //Holt alle Länder
    function getCountrys()
    {
        return countrys;
    }
 
    //Holt die Farbe
    function getColor()
    {
        return color;
    }
    
    //Setzt nur gültige Hex-Farben
    function setColor(settedColor)
    {
        if(typeof settedColor !== "string")
            throw new TypeError("Setted Color is not a String");
        
        //Scheint unnötig jetzt
        //if(settedColor.charAt(0) !== '#')
            //throw new Error("Color doesnt start with a #");
        
        //if(settedColor.length !== 7)
            //throw new Error("Color not long enough");
        
        if(settedColor.match(/^#[\da-f]{3}([\da-f]{3}|)$/i))
            color = settedColor;
        else
            throw new Error("This is not a valid Hexa-Color");
    }
    
    //Holt die Id des Spielers
    function getId()
    {
        return id;
    }
    
    //Setzt die Spieler-id kann nur einmal aufgerufen werden
    function setId(settedId)
    {
        if(isNaN(settedId))
            throw new TypeError("Id has to be a Number");
        if(idIsSetted)
            throw new Error("Cant set Id more than Once");
        
        id = settedId;
        idIsSetted = true;
    }
    
    //Serialisiert das Object
    function serialize()
    {
        var playerObject = serializeAsObject();
        
        return JSON.stringify(playerObject);
    }
    
    //Serialisiert das Object
    function serializeAsObject()
    {
        var id = getId();
        var name = getName();
        var color = getColor();
        var type = getType();
        
        var playerObject = {
            id: id,
            name: name,
            color: color,
            type: type
        };
        
        return playerObject;
    }
    
    function getType()
    {
        return type;
    }
    
    function setType(aType)
    {
        if(typeof aType !== "string")
            throw new TypeError("Type must be human or bot");
        
        aType = aType.toLowerCase();
        
        if(! (aType === "human" || aType === "bot") )
            throw new TypeError("Type must be human or bot");
        
        type = aType;
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
    this.serializeAsObject = serializeAsObject;
    
    this.setType = setType;
    this.getType = getType;
};