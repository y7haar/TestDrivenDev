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

function placingState(aMap, unitCount)
{ 
    if (!(aMap instanceof tddjs.client.map.map))
        throw new TypeError("given Map is not instance of Map");
    if (isNaN(unitCount) || unitCount === null)
        throw new TypeError("given unitCount is not a Number");
 
    var _map = aMap;
    var _unitCount = unitCount;
    
    function toString()
    {
        return "placingState";
    }

    function isMoveLegal(move)
    {      

        if (typeof move !== 'object')
            throw new TypeError("given Move is not in right Format");

        if (move.type !== 'placing')
            return false;

        if (move.unitCount > _unitCount)
            return false;

        //test if Continent exists 
        if (!_map.hasContinent(move.continent))
            return false;

        //test if Country not exists on the Continent in moveObject 
        if (!_map.getContinent(move.continent).hasCountryByName(move.country))
            return false;
        //test if the player dont own the Country    
        if (_map.getContinent(move.continent).getCountry(move.country).getOwner().getName() !== move.player)
            return false;
        // if passed till here move is Valid
        return true;

    }  
    this.isMoveLegal = isMoveLegal;
    this.toString = toString;
    
    //test properties
    Object.defineProperty(this, 'map', {
        get: function () {
            return _map;
        }
    });    
    Object.defineProperty(this, 'unitCount', {
        get: function () {
            return _unitCount;
        }
    });
}
placingState.prototype = new state();
placingState.prototype.constructor = placingState;

function attackingState(aMap)
{
    if (!(aMap instanceof tddjs.client.map.map))
            throw new TypeError("given Map is not instance of Map");
    var _map = aMap;
        
    function isMoveLegal(move)
    {    

        if (typeof move !== 'object')
            throw new TypeError("given Move is not in right Format");

        if (move.type !== 'attack')
            return false;

        var attacker = move.from;
        var defender = move.to;

        //attacker tests
        if (!_map.hasContinent(attacker.continent))
            return false;
        if (!_map.getContinent(attacker.continent).hasCountryByName(attacker.country))
            return false;
        if (_map.getContinent(attacker.continent).getCountry(attacker.country).getOwner().getName() !== attacker.player)
            return false;

        //defender tests
        if (!_map.hasContinent(defender.continent))
            return false;
        if (!_map.getContinent(defender.continent).hasCountryByName(defender.country))
            return false;
        if (_map.getContinent(defender.continent).getCountry(defender.country).getOwner().getName() !== defender.player)
            return false;

        //border tests
        var attackerCountry = _map.getContinent(attacker.continent).getCountry(attacker.country);
        var defenderCountry = _map.getContinent(defender.continent).getCountry(defender.country);

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
    
    //test properties
    Object.defineProperty(this, 'map', {
        get: function () {
            return _map;
        }
    }); 
    
}
attackingState.prototype = new state();
attackingState.prototype.constructor = attackingState;

function waitingState()
{
    function toString()
    {
        return "waitingState";
    }
    
    function isMoveLegal()
    {
        return false;
    }
    
    this.isMoveLegal = isMoveLegal;
    this.toString = toString;
}
waitingState.prototype = new state();
waitingState.prototype.constructor = waitingState;