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
    
    "test Playername should be able to setted and getted": function() {
        this.player1.setName("Ranol");
        assertEquals("Ranol", this.player1.getName());
    }
});

