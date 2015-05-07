 /* 
 * Testcases for Player
 */
TestCase("PlayerTest",
{
    setUp: function () {
        this.player1 = Object.create(tddjs.client.Player);
        this.country1 = Object.create(tddjs.client.map.Country);
    },
    
    "test Player Object should be created": function () {
        assertObject(this.player1);
    },
    
    "test Playername should be defined": function() {
        assertNotUndefined(this.player1.getName());
    },
    
    "test Playername should be able to setted and getted correctly": function() 
    {
        var test;
        var player = this.player1;
        this.player1.setName("Ranol");
        assertEquals("Ranol", this.player1.getName());
        assertException(function(){player.setName(test);},"TypeError");
        assertException(function(){player.setName(125);},"TypeError");
        assertException(function(){player.setName(this.player1);},"TypeError");
    },
    
    "test Shouldnt be able to ask for Countries which arent countries": function() {
        var player = this.player1;
        assertException(function(){ player.hasCountry({});},"Error");
    },
    
    "test Should be able to add a Country": function() {
        this.player1.addCountry(this.country1);
    },
    
    "test Shouldnt be able to add something thats not a Country": function()
    {
        var player = this.player1;
        var test = 5;
        assertException(function(){player.addCountry(test);});
    }
});

