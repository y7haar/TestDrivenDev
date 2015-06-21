/* 
 * 
 */


tddjs.namespace("client.map").water=water;
         
function water()
{
    var _border=[[]];
    var _name;
    
    function addBorder(aCountry1,aCountry2)
    {
        if(!(aCountry1 instanceof tddjs.client.map.country) || !(aCountry2 instanceof tddjs.client.map.country))
            throw new TypeError("Parameter is not instance of country.");
        _border.push([aCountry1,aCountry2]);
    }
    
    function getBorders()
    {
        return _border;
    }

    function getBorderCount()
    {
        return _border.length;
    }
    
    this.addBorder = addBorder;
    this.getBorders = getBorders;
    this.getBorderCount = getBorderCount;
}
