/* 
Source-Code for Country
 */


(function()
{
    var _border ;
    
    function addBorder(aCountry)
    {
        _border = aCountry;
      
    }
    
    function getBorderCount()
    {
        if(typeof _border === "undefined") return 0;
        else return 1; 
    }
    
    function borders(aCountry)
    {
        if( getBorderCount() == 1)
        {
            return (_border === aCountry);
        }
        else return false;
    }
    
    tddjs.namespace("client.map").Country = {
        addBorder: addBorder,
        getBorderCount: getBorderCount,
        borders: borders
    };    
}());