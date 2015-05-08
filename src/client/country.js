/* 
Source-Code for Country
 */

tddjs.namespace("client.map").country= country;
         
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
        if(typeof _name == "undefined")
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
        if(!(aCountry instanceof tddjs.client.map.country))
            throw new TypeError("Parameter is not instance of country.");
        _border.push(aCountry);
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
            throw new Error("Count forbbided to be under 1");
        _unitCount = count ;   
    }
    
    function setOwner(aOwner)
    {    
        if(!(aOwner instanceof tddjs.client.player))
            throw new TypeError("parameter is not a instace of Player");
        _owner = aOwner;
    }
    
    function getOwner()
    {
        if (typeof _owner == "undefined")
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
    /*
    { 
    addBorder : addBorder,
    getBorderCount : getBorderCount,
    borders : borders,
    
    getUnitCount : getUnitCount,
    setUnitCount : setUnitCount, 
    addUnits : addUnits,
    subUnits : subUnits,
    
    setOwner : setOwner,
    getOwner : getOwner
    };
    */
    this.setName = setName;
    this.getName = getName;

    this.addBorder = addBorder;
    this.getBorderCount = getBorderCount;
    this.borders = borders;

    this.getUnitCount = getUnitCount;
    this.setUnitCount = setUnitCount;
    this.addUnits = addUnits;
    this.subUnits = subUnits;

    this.setOwner = setOwner;
    this.getOwner = getOwner;   
    
};

    
  
