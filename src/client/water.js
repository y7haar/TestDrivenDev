/* 
 * 
 */


tddjs.namespace("client.map").water=water;
         
function water()
{
    var _border=[];
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
    
    function setName(aName)
    {
        if(typeof aName !== "string")
            throw new TypeError("Parameter is not a String.");
        _name = aName;            
    }
    
    function getName()
    {
        if(typeof _name === "undefined")
        {
            
            throw {
                name: "initError",
                level: "FatalError",
                message: "Parameter is undefined, call country.setName before.",
                htmlMessage: "Error detected. Please contact support.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        return _name;
    }
    
    this.setName = setName;
    this.getName = getName;
    
    this.addBorder = addBorder;
    this.getBorders = getBorders;
    this.getBorderCount = getBorderCount;
}
