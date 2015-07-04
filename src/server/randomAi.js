/* 
Source-Code for AI 
 */
if(typeof module !== "undefined")
{
    module.exports = randomAi;
}
else
    tddjs.namespace("server.controller").randomAi = randomAi;

function randomAi()
{
    function evaluateAttack(aFrom, aTo)
    {
        return aFrom.getUnitCount() / aTo.getUnitCount();
    }
    
    this.evaluateAttack = evaluateAttack;
};


