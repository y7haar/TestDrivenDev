/* 
 * Source-code of the StatePattern for the gameLoopController
 * 
 *  4-States: PlaceingState, AttackingState, MovingState, WaitingState
 *  all inherit from one State function
 */


tddjs.namespace("client").placingState = placingState;
tddjs.namespace("client").attackingState = attackingState;
tddjs.namespace("client").waitingState = waitingState;
tddjs.namespace("client").abstractState = state;

function state()
{
    
}
state.prototype.isMoveLegal = null;
state.prototype.toString = null;

function placingState()
{ 
    function toString()
    {
        return "placingState";
    }

    function isMoveLegal(currentMap, unitCount, move)
    {
        if (!(currentMap instanceof tddjs.client.map.map))
            throw new TypeError("given Map is not instance of Map");

        if (isNaN(unitCount))
            throw new TypeError("given unitCount is not a Number");

        if (typeof move !== 'object')
            throw new TypeError("given Move is not in right Format");

        if (move.type !== 'placing')
            return false;

        if (move.unitCount > unitCount)
            return false;

        //test if Continent exists 
        if (!currentMap.hasContinent(move.continent))
            return false;

        //test if Country not exists on the Continent in moveObject 
        if (!currentMap.getContinent(move.continent).hasCountryByName(move.country))
            return false;
        //test if the player dont own the Country    
        if (currentMap.getContinent(move.continent).getCountry(move.country).getOwner().getName() !== move.player)
            return false;
        // if passed till here move is Valid
        return true;

    }  
    this.isMoveLegal = isMoveLegal;
    this.toString = toString;
}
placingState.prototype = new state();
placingState.prototype.constructor = placingState;

function attackingState()
{
    function isMoveLegal(currentMap, move)
    {
        if (!(currentMap instanceof tddjs.client.map.map))
            throw new TypeError("given Map is not instance of Map");

        if (typeof move !== 'object')
            throw new TypeError("given Move is not in right Format");

        if (move.type !== 'attack')
            return false;

        var attacker = move.from;
        var defender = move.to;

        //attacker tests
        if (!currentMap.hasContinent(attacker.continent))
            return false;
        if (!currentMap.getContinent(attacker.continent).hasCountryByName(attacker.country))
            return false;
        if (currentMap.getContinent(attacker.continent).getCountry(attacker.country).getOwner().getName() !== attacker.player)
            return false;

        //defender tests
        if (!currentMap.hasContinent(defender.continent))
            return false;
        if (!currentMap.getContinent(defender.continent).hasCountryByName(defender.country))
            return false;
        if (currentMap.getContinent(defender.continent).getCountry(defender.country).getOwner().getName() !== defender.player)
            return false;

        //border tests
        var attackerCountry = currentMap.getContinent(attacker.continent).getCountry(attacker.country);
        var defenderCountry = currentMap.getContinent(defender.continent).getCountry(defender.country);

        if (!(attackerCountry.borders(defenderCountry) && defenderCountry.borders(attackerCountry)))
            return false;
        
        // if passed till here move is Valid
        return true;

    }
    
    function toString()
    {
        return "attackingState";
    }   

    this.isMoveLegal = isMoveLegal;
    this.toString = toString;   
    
}
attackingState.prototype = new state();
attackingState.prototype.constructor = attackingState;

function waitingState()
{
    
}
waitingState.prototype = new state();
waitingState.prototype.constructor = waitingState;