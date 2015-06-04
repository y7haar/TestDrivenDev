/* 
 * Source Code für Spieler
 */
tddjs.namespace("server").player = player;

function player()
{
    
    //Werte
    var name = "";
    var id;
    var idIsSetted = false;
    var color = "#000000";
    
    var _token;
    
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
    
    function setToken(token)
    {
        if(typeof token !== "string")
            throw new TypeError("Token has to be a string");
        
        if(typeof _token !== "undefined")
            throw new Error("Cant set token more than Once");
        
        _token = token;
    }
    
    function getToken()
    {
        return _token;
    }
    
    //Serialisiert das Object
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
    
    //Serialisiert das Object
    function serializeAsObject()
    {
        var id = getId();
        var name = getName();
        var color = getColor();
        
        var playerObject = {
            id: id,
            name: name,
            color: color
        };
        
        return playerObject;
    }
    
    function deserialize(json)
    {
        var obj = JSON.parse(json);
        
        this.setId(obj.id);
        this.setName(obj.name);
        this.setColor(obj.color);
    }
  
    this.getName = getName;
    this.setName = setName;

    this.setToken = setToken;
    this.getToken = getToken;
    
    this.getColor = getColor;
    this.setColor = setColor;
    this.getId = getId;
    this.setId = setId;
    this.serialize = serialize;
    this.serializeAsObject = serializeAsObject;
    this.deserialize = deserialize;
}