/* 
 *  Source-code for stateTest.js
 *  this code test the statePattern from gameLoopController
 *  there are 4 states PlaceingState, AttackingState, MovingState, WaitingState
 */


TestCase("stateTest", {
    setUp: function () {
        
        this.placeing = new tddjs.client.placeingState();
        this.moving = new tddjs.client.movingState();
        this.attacking = new tddjs.client.attackingState();
        this.waiting = new tddjs.client.waitingState();

    }, 
    tearDown: function ()
    {
        this.placeing = null;
        this.moving = null;
        this.attacking = null;
        this.waiting = null;
    },    
    "test states should not be undefined": function () {  
        assertNotUndefined(this.placeing);
        assertNotUndefined(this.moving);
        assertNotUndefined(this.attacking);
        assertNotUndefined(this.waiting);
    },
     "test states should be instanace of theire state and prototype": function () {  
        assertTrue(this.placeing instanceof tddjs.client.placeingState);
        assertTrue(this.moving instanceof tddjs.client.movingState);
        assertTrue(this.attacking instanceof tddjs.client.attackingState);
        assertTrue(this.waiting instanceof tddjs.client.waitingState);
        
        assertTrue(this.placeing instanceof tddjs.client.abstractState);
        assertTrue(this.moving instanceof tddjs.client.abstractState);
        assertTrue(this.attacking instanceof tddjs.client.abstractState);
        assertTrue(this.waiting instanceof tddjs.client.abstractState);       
    },
    
    "test states should have all functions": function () {
        
        assertNotUndefined(this.placeing.placeUnits);
        assertNotUndefined(this.placeing.endPlaceingPhase);
        assertNotUndefined(this.placeing.attack);
        assertNotUndefined(this.placeing.endAttackingPhase);
        assertNotUndefined(this.placeing.moveUnits);
        assertNotUndefined(this.placeing.endMovingPhase);
        assertNotUndefined(this.placeing.endWaitingPhase);
        assertNotUndefined(this.placeing.getUpdates);
        assertNotUndefined(this.placeing.isMoveLegal);

        assertNotUndefined(this.attacking.placeUnits);
        assertNotUndefined(this.attacking.endPlaceingPhase);
        assertNotUndefined(this.attacking.attack);
        assertNotUndefined(this.attacking.endAttackingPhase);
        assertNotUndefined(this.attacking.moveUnits);
        assertNotUndefined(this.attacking.endMovingPhase);
        assertNotUndefined(this.attacking.endWaitingPhase);
        assertNotUndefined(this.attacking.getUpdates);
        assertNotUndefined(this.attacking.isMoveLegal);

        assertNotUndefined(this.moving.placeUnits);
        assertNotUndefined(this.moving.endPlaceingPhase);
        assertNotUndefined(this.moving.attack);
        assertNotUndefined(this.moving.endAttackingPhase);
        assertNotUndefined(this.moving.moveUnits);
        assertNotUndefined(this.moving.endMovingPhase);
        assertNotUndefined(this.moving.endWaitingPhase);
        assertNotUndefined(this.moving.getUpdates);
        assertNotUndefined(this.moving.isMoveLegal);

        assertNotUndefined(this.waiting.placeUnits);
        assertNotUndefined(this.waiting.endPlaceingPhase);
        assertNotUndefined(this.waiting.attack);
        assertNotUndefined(this.waiting.endAttackingPhase);
        assertNotUndefined(this.waiting.moveUnits);
        assertNotUndefined(this.waiting.endMovingPhase);
        assertNotUndefined(this.waiting.endWaitingPhase);
        assertNotUndefined(this.waiting.getUpdates);
        assertNotUndefined(this.waiting.isMoveLegal);           
    }
    
    
});

