/* 
Source-Code for Country
 */

tddjs.namespace("client.map");

(function()
{
   
    var _border = [];
    var _unitCount = 1;
    var _owner; 
    
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

        if (this._unitCount - count < 1)
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
        if(typeof aOwner != "object")
            throw new TypeError("setOwner expects a Player object as Parameter");
        _owner = aOwner;
    }
    
    function getOwner()
    {
        return _owner;
    }
    
    tddjs.namespace("client.map").Country = {    
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
    
}());

    
  
