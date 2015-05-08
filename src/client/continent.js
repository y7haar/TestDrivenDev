/* 
Source-Code for Continent
 */

tddjs.namespace("client.map").continent = continent;

function continent()
{
    var _country = [];
    var _unitBonus;

    function setUnitBonus(number)
    {
        if (isNaN(number))
        {           
            throw new TypeError("Parameter ist not a Number.");
        }
        else if (number < 0)
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

        _unitBonus = number;
    }

    function getUnitBonus()
    {
        if (typeof _unitBonus == "undefined")
            throw new Error("unitBonus is undefined, call setUnitBonus before");
        return _unitBonus;
    }

    function addCountry(aCountry)
    {
        if (!(aCountry instanceof tddjs.client.map.country))
            throw new TypeError("Parameter ist not instance of Country");

        _country.push(aCountry);
    }

    function getCountryCount()
    {
        return _country.length;
    }

    function hasCountry(aCountry)
    {
        if (_country.indexOf(aCountry) >= 0)
            return true;
        else
            return false;
    }

    function getCountrys()
    {
        return _country;
    }


    this.setUnitBonus = setUnitBonus;
    this.getUnitBonus = getUnitBonus;

    this.addCountry = addCountry;
    this.getCountryCount = getCountryCount;
    this.getCountrys = getCountrys;
    this.hasCountry = hasCountry;

};