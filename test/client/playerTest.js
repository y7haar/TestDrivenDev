 /* 
 * Testcases for Player
 */
TestCase("PlayerTest", {
    setUp: function () {
        this.player1 = Object.create(tddjs.client.Player); 
    },
    
    "test Player Object should be created": function () {
        assertObject(this.player1);
    },
    
    "test Playername should be defined": function() {
        assertNotUndefined(this.player1.getName());
    },
    
    "test Playername should be able to setted and getted correctly": function() {
        this.player1.setName("Ranol");
        assertEquals("Ranol", this.player1.getName());
        assertException(function(){this.player1.setName(Undefined);},"TypeError");
        assertException(function(){this.player1.setName(125);},"TypeError");
        assertException(function(){this.player1.setName(this.player1);},"TypeError");
    }
});

