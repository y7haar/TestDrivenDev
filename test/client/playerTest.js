 /* 
 * Testcases for Player
 */
TestCase("PlayerTest", {
    setUp: function () {
        this.player1 = Object.create(tddjs.client.Player); 
    },
    
    "test Player Object should be created": function () {
        assertObject(this.player1);
    }
});

