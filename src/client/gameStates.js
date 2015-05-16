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
state.prototype.endPlaceingPhase = null;
state.prototype.attack = null;
state.prototype.endAttackingPhase = null;
state.prototype.moveUnits = null;
state.prototype.endMovingPhase = null;
state.prototype.endWaitingPhase = null;
state.prototype.getUpdates = null;
state.prototype.isMoveLegal = null;

function placingState()
{
   function placeUnits()
   {
       
   }
   
   function endPlacingPhase()
   {
       
   }
   function getUpdates()
   {
       
   }
   
   function toString()
   {
       return "placingState";
   }
   
   function isMoveLegal(currentMap, unitCount, move)
   {
       if(!(currentMap instanceof tddjs.client.map.map))
           throw new TypeError("given Map is not instance of Map");
       
       if(isNaN(unitCount))
           throw new TypeError("given unitCount is not a Number");
       
       if(move.type !== 'placing')
           return false;
    
       if(move.unitCount > unitCount)
           return false;
 
       //test if Continent exists 
       if(! currentMap.hasContinent(move.continent))
           return false;
       else
       {
           //test if Country not exists on the Continent in moveObject 
           if(! currentMap.getContinent(move.continent).hasCountryByName(move.country))
               return false;
           //test if the player dont own the given Country    
           else if(currentMap.getContinent(move.continent).getCountry(move.country).getOwner().getName() !== move.player)
               return false;
           else return true;
       }
       
   }
   
   this.placeUnits = placeUnits;
   this.endPlacingPhase = endPlacingPhase;
   this.getUpdates = getUpdates;
   this.isMoveLegal = isMoveLegal;
   this.toString = toString;
}
placingState.prototype = new state();
placingState.prototype.constructor = placingState;

function attackingState()
{
    
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