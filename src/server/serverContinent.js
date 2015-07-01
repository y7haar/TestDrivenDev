/* 
Source-Code for Continent
 */
if(typeof module !== "undefined")
{
    module.exports = continent;
}
else
    tddjs.namespace("server.map").continent = continent;

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
        if (typeof _unitBonus === "undefined")
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
        if (!(isCountry(aCountry)))
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
        if (typeof _countrys[aCountry.getName()] !== "undefined" )
            return true;
        else
            return false;
    }
    
    function hasCountryByName(aCountryName)
    {
        if(typeof _countrys[aCountryName] !== "undefined")
            return true;
        else return false;
    }
    
    function getCountry(aCountryName)
    {
        if(hasCountryByName(aCountryName))
            return _countrys[aCountryName];
        else return ;
    }

    function getCountrys()
    {
        return _countrys;
    }
    
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
                message: "Parameter is undefined, call continent.setName before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        else return _name;
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


