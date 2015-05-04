/* 
Source-Code for Country
 */


(function()
{
    var _border = [] ;
    
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
    
    tddjs.namespace("client.map").Country = {
        addBorder: addBorder,
        getBorderCount: getBorderCount,
        borders: borders
    };    
}());