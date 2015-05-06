/* 
Source-Code for Country
 */

tddjs.namespace("client.map");

(function()
{
    function Country(){
        this._border = [];
        this._unitCount = 1;
        this._owner;
    }
    tddjs.client.map.Country = Country;
    
    function addBorder(aCountry)
    {
        this._border.push(aCountry);
    }

    function getBorderCount()
    {
        return this._border.length;
    }

    function borders(aCountry)
    {
        if (this._border.indexOf(aCountry) >= 0)
            return true;
        else
            return false;
    }

    function getUnitCount()
    {
        return this._unitCount;
    }

    function addUnits(count)
    {
        if (isNaN(count))
            throw new TypeError("Parameter is not a number");
        else
            this._unitCount += count;
    }

    function subUnits(count)
    {
        if (isNaN(count))
            throw new TypeError("Parameter is not a number");

        if (this._unitCount - count < 1)
            this._unitCount = 1;
        else
            this._unitCount -= count;
    }
    
    function setUnitCount(count)
    {
        if(count < 1 )
            throw new Error("Count forbbided to be under 1");
       this._unitCount = count ;   
    }
    
    function setOwner(aOwner)
    {
        if(typeof aOwner != "object")
            throw new TypeError("setOwner expects a Player object as Parameter");
        this._owner = aOwner;
    }
    
    function getOwner()
    {
        return this._owner;
    }

    Country.prototype.addBorder = addBorder;
    Country.prototype.getBorderCount = getBorderCount;
    Country.prototype.borders = borders;
    
    Country.prototype.getUnitCount = getUnitCount;
    Country.prototype.setUnitCount = setUnitCount; 
    Country.prototype.addUnits = addUnits;
    Country.prototype.subUnits = subUnits;
    
    Country.prototype.setOwner = setOwner;
    Country.prototype.getOwner = getOwner;
    
}());

    
  
