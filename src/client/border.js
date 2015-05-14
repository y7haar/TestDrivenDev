/* 
 * Sourcecode für Border zur Maperstellung
 */

tddjs.namespace("client.map").border = border;

function border()
{
    var leftCountry;
    var rigthCountry;
    
    function setLeftCountry(setCountry)
    {
        if(!(setCountry instanceof(tddjs.client.map.country)))
            throw new TypeError("Can only set countries");
        leftCountry = setCountry;
    }
    
    function setRigthCountry(setCountry)
    {
        if(!(setCountry instanceof(tddjs.client.map.country)))
            throw new TypeError("Can only set countries");
        rigthCountry = setCountry;
    }
    
    function getLeftCountry(){return leftCountry;}
    function getRigthCountry(){return rigthCountry;}
    
    this.setLeftCountry = setLeftCountry;
    this.setRigthCountry = setRigthCountry;
    this.getLeftCountry = getLeftCountry;
    this.getRigthCountry = getRigthCountry;
};
