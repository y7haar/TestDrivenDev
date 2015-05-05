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
            _unitCount == 1;
        else
            _unitCount -= count;
    }

    Country.prototype.addBorder = addBorder;
    Country.prototype.getBorderCount = getBorderCount;
    Country.prototype.borders = borders;
    Country.prototype.getUnitcount = getUnitCount;
    Country.prototype.addUnits = addUnits;
    Country.prototype.subUnits = subUnits;    
    
}());

    
  
