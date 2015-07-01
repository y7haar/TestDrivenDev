/* 
Source-Code for Country
 */
if(typeof module !== "undefined")
{
    module.exports = country;
}
else
    tddjs.namespace("server.map").country = country;
         
function country()
{   
    var _border = [];
    var _unitCount = 1;
    var _owner;
    var _name;
    
    function setName(aName)
    {
        if(typeof aName !== "string")
            throw new TypeError("Parameter is not a String.");
        
        _name = aName;            
    }
    
    function getName()
    {
        if(typeof _name === "undefined")
        {           
            throw {
                name: "initError",
                level: "FatalError",
                message: "Parameter is undefined, call country.setName before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        return _name;
    }

    function addBorder(aCountry)
    {
        if(!(isCountry(aCountry)))
            throw new TypeError("Parameter is not instance of country.");
        
        _border.push(aCountry);
    }
    
    function getBorders()
    {
        return _border;
    }

    function getBorderCount()
    {
        return _border.length;
    }

    function borders(aCountry)
    {
        if (_border.indexOf(aCountry) >= 0)
            return true;
        else
            return false;
    }

    function getUnitCount()
    {
        return _unitCount;
    }

    function addUnits(count)
    {
        if (isNaN(count))
            throw new TypeError("Parameter is not a number");
        else
            _unitCount += count;
    }

    function subUnits(count)
    {
        if (isNaN(count))
            throw new TypeError("Parameter is not a number");

        if (_unitCount - count < 1)
            _unitCount = 1;
        else
            _unitCount -= count;
    }
    
    function setUnitCount(count)
    {
        if(count < 1 )
            throw new Error("Count not allowed to be under 1");
        _unitCount = count ;   
    }
    
    function setOwner(aOwner)
    {    
        if(!(isPlayer(aOwner)))
            throw new TypeError("parameter is not a instace of Player");
        _owner = aOwner;
    }
    
    function getOwner()
    {
        if (typeof _owner === "undefined")
        {
            throw {
                name: "initError",
                level: "FatalError",
                message: "Parameter is undefined, call country.setOwner before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }

        return _owner;
    }
 
    function isCountry(country)
    {
        if(typeof country.getName === "undefined")
            return false;
        
        if(typeof country.getBorders === "undefined")
            return false;
        
        if(typeof country.getUnitCount === "undefined")
            return false;
        
        if(typeof country.getOwner === "undefined")
            return false;
        
        return true;
    }
    
    function isPlayer(player)
    {
        if(typeof player.getName === "undefined")
            return false;
        
        if(typeof player.getId === "undefined")
            return false;
        
        return true;
    }
 
    this.setName = setName;
    this.getName = getName;

    this.addBorder = addBorder;
    this.getBorders = getBorders;
    this.getBorderCount = getBorderCount;
    this.borders = borders;

    this.getUnitCount = getUnitCount;
    this.setUnitCount = setUnitCount;
    this.addUnits = addUnits;
    this.subUnits = subUnits;

    this.setOwner = setOwner;
    this.getOwner = getOwner;       
};


