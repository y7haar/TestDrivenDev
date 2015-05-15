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
   function isMoveLegal()
   {
       
   }
   
   this.placeUnits = placeUnits;
   this.endPlacingPhase = endPlacingPhase;
   this.getUpdates = getUpdates;
   this.isMoveLegal = isMoveLegal;
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