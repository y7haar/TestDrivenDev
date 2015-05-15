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
        assertTrue(this.moving instanceof tddjs.client.moveingState);
        assertTrue(this.attacking instanceof tddjs.client.attackingState);
        assertTrue(this.waiting instanceof tddjs.client.waitingingState);
        
        assertTrue(this.placeing instanceof tddjs.client.state);
        assertTrue(this.moving instanceof tddjs.client.state);
        assertTrue(this.attacking instanceof tddjs.client.state);
        assertTrue(this.waiting instanceof tddjs.client.state);       
    }
    
});

