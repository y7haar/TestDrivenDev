/* 
 * Source-code of the StatePattern for the gameLoopController
 * 
 *  4-States: PlaceingState, AttackingState, MovingState, WaitingState
 *  all inherit from one State function
 */


tddjs.namespace("client").placingState = placingState;
tddjs.namespace("client").attackingState = attackingState;
tddjs.namespace("client").movingState = movingState;
tddjs.namespace("client").waitingState = waitingState;
tddjs.namespace("client").abstractState = state;

function state()
{
    
}
state.prototype.placeUnits = null;
state.prototype.attack = null;
state.prototype.moveUnits = null;
state.prototype.isMoveLegal = null;
state.prototype.endPhase = null;
state.prototype.toString = null;

function placingState()
{
    function placeUnits(currentMap, unitCount, move, url)
    {
        if (typeof url !== 'string')
            throw new TypeError("given url is not a String");
        if (!isMoveLegal(currentMap, unitCount, move))
            return false;
        // ajax POST to server with the move, server should validate the move then trigger eventSource event       
    }

    function endPhase()
    {
        //ajax Post to server that player want to end this Phase 
    }
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
    this.placeUnits = placeUnits;
    this.isMoveLegal = isMoveLegal;
    this.toString = toString;
    this.endPhase = endPhase;
}
placingState.prototype = new state();
placingState.prototype.constructor = placingState;

function attackingState()
{
    function attack(currentMap, move, url)
    {
        
    }
    
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
    
    function endPhase()
    {
        
    }
    
    this.attack = attack;
    this.isMoveLegal = isMoveLegal;
    this.endPhase = endPhase;
    this.toString = toString;   
    
}
attackingState.prototype = new state();
attackingState.prototype.constructor = attackingState;

function movingState()
{
   
}
movingState.prototype = new state();
movingState.prototype.constructor = movingState;

function waitingState()
{
    
}
waitingState.prototype = new state();
waitingState.prototype.constructor = waitingState;