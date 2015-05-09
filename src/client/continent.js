/* 
Source-Code for Continent
 */

tddjs.namespace("client.map").continent = continent;

function continent()
{
    var _countrys = {};
    var _unitBonus;
    var _name;

    function setUnitBonus(number)
    {
        if (isNaN(number))
        {           
            throw new TypeError("Parameter ist not a Number.");
        }
        else if (number < 0)
            throw new Error("Parameter is under 0");      

        _unitBonus = number;
    }

    function getUnitBonus()
    {
        if (typeof _unitBonus == "undefined")
        {
            throw {
                name: "initError",
                level: "FatalError",
                message: "Parameter is undefined, call continent.setUnitBonus before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        return _unitBonus;
    }

    function addCountry(aCountry)
    {
        if (!(aCountry instanceof tddjs.client.map.country))
            throw new TypeError("Parameter ist not instance of Country");
        
        var countryName = aCountry.getName();
        _countrys[countryName] = aCountry;
    }

    function getCountryCount()
    {
        return Object.keys(_countrys).length;
    }

    function hasCountryByObject(aCountry)
    {
        if (typeof _countrys[aCountry.getName()] != "undefined" )
            return true;
        else
            return false;
    }
    
    function hasCountryByName(aCountryName)
    {
        if(typeof _countrys[aCountryName] != "undefined")
            return true;
        else return false;
    }
    
    function getCountry(aCountryName)
    {
        if(hasCountryByName(aCountryName))
            return _countrys[aCountryName];
        else return null;
    }

    function getCountrys()
    {
        return _countrys;
    }
    
    function setName(aName)
    {
        if(typeof aName != "string")
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
                message: "Parameter is undefined, call continent.setName before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        else return _name;
    }


    this.setUnitBonus = setUnitBonus;
    this.getUnitBonus = getUnitBonus;

    this.addCountry = addCountry;
    this.getCountryCount = getCountryCount;
    this.getCountrys = getCountrys;
    this.hasCountryByObject = hasCountryByObject;
    this.hasCountryByName = hasCountryByName;
    this.getCountry = getCountry;
    
    this.getName = getName;
    this.setName = setName;

};