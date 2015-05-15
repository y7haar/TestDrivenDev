/* 
 * Source-code of the StatePattern for the gameLoopController
 * 
 *  4-States: PlaceingState, AttackingState, MovingState, WaitingState
 *  all inherit from one State function
 */


tddjs.namespace("client").placeingState = placeingState;
tddjs.namespace("client").attackingState = attackingState;
tddjs.namespace("client").movingState = movingState;
tddjs.namespace("client").waitingState = waitingState;
tddjs.namespace("client").abstractState = state;

function state()
{
    
}
state.prototype.placeUnits= null;
state.prototype.endPlaceingPhase= null;
state.prototype.attack = null;
state.prototype.endAttackingPhase = null;
state.prototype.moveUnits= null;
state.prototype.endMoveingPhase= null;
state.prototype.getUpdates= null;
state.prototype.isMoveLegal= null;

function placeingState()
{
    
}
placeingState.prototype = new state();
placeingState.prototype.constructor = placeingState;

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