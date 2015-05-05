/* 
Source-Code for Country
 */

tddjs.namespace("client.map");

(function()
{
    function Country(){
        this._border = [];
        this._unitCount = 1;
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
            this._unitCount == 1;
        else
            this._unitCount -= count;
    }

    Country.prototype.addBorder = addBorder;
    Country.prototype.getBorderCount = getBorderCount;
    Country.prototype.borders = borders;
    
    Country.prototype.getUnitCount = getUnitCount;
    Country.prototype.addUnits = addUnits;
    Country.prototype.subUnits = subUnits;    
    
}());

    
  
