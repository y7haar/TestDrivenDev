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
    
    tddjs.namespace("client.map").Country = {
        addBorder: addBorder,
        getBorderCount: getBorderCount
    };    
}());