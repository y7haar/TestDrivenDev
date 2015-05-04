/* 
Source-Code for Country
 */


(function()
{
    var _border = [] ;
    var _unitCount = 1;
    
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
        if( _border.indexOf(aCountry) >= 0) return true;        
        else return false;
    }
    
    function getUnitCount()
    {
        return _unitCount;
    }
    
    function addUnits(count)
    {
        if(isNaN(count))throw new TypeError("Parameter is not a number");
        else _unitCount += count;
    }
    
    function subUnits(count)
    {
        _unitCount -= count;
    }
    
    tddjs.namespace("client.map").Country = {
        addBorder: addBorder,
        getBorderCount: getBorderCount,
        borders: borders,
        getUnitCount: getUnitCount,
        addUnits: addUnits,
        subUnits: subUnits
    };    
}());