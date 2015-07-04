/* 
Source-Code for AI 
 */
if(typeof module !== "undefined")
{
    module.exports = randomAi;
}
else
    tddjs.namespace("server.controller").randomAi = randomAi;

function randomAi(aPlayer)
{
    var _player = aPlayer;
    
    function evaluateAttack(aFrom, aTo)
    {
        return aFrom.getUnitCount() / aTo.getUnitCount();
    }
    
    function evaluatePlacing(aCountry)
    {
        var borderCountries = aCountry.getBorders();
        var sum = 0;
        
        for(var i = 0;i < borderCountries.length;++i)
        {
            if(borderCountries[i].getOwner() !== _player)
                sum += borderCountries[i].getUnitCount() / aCountry.getUnitCount();
        }
        
        return sum;
    }
    
    this.evaluateAttack = evaluateAttack;
    this.evaluatePlacing = evaluatePlacing;
};


