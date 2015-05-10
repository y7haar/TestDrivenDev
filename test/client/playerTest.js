 /* 
 * Testcases for Player
 */
TestCase("PlayerTest",
{
    setUp: function () {
        this.player1 = new tddjs.client.player();
        this.country1 = new tddjs.client.map.country();
        this.country2 = new tddjs.client.map.country();
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
        assertException(function(){player.setName(player);},"TypeError");
    },
    
    "test Shouldnt be able to ask for Countries which arent countries": function()
    {
        var player = this.player1;
        assertException(function(){ player.hasCountry({});}, "TypeError");
    },
    
    "test Shouldnt be able to add something thats not a Country": function()
    {
        var player = this.player1;
        var test = 5;
        assertException(function(){player.addCountry(test);},"TypeError");
    },
    
    "test Should be able to add a Country and find it afterwards": function()
    {
        assertFalse(this.player1.hasCountry(this.country1));
        this.player1.addCountry(this.country1);
        assertTrue(this.player1.hasCountry(this.country1));
    },
    
    "test Shouldnt be able to remove something thats not a Country": function()
    {
        var player = this.player1;
        var test = 5;
        assertException(function(){player.removeCountry(test);},"TypeError");
        assertException(function(){player.removeCountry(player);},"TypeError");
    },
    
    "test Should be able to add and remove a Country. A removed Country should not be found": function()
    {
        assertFalse(this.player1.hasCountry(this.country2));
        this.player1.addCountry(this.country2);
        assertTrue(this.player1.hasCountry(this.country2));
        this.player1.removeCountry(this.country2);
        assertFalse(this.player1.hasCountry(this.country2));
    },
    
    "test Shouldnt be able to remove a Country that has net been added": function() {
        var player = this.player1;
        var country2 = this.country2
        assertException(function(){player.removeCountry(country2)}, "Error");
    },
    
    "test Should be able to get a valid Country-Count": function()
    {
        var x = this.player1.getCountryCount();
        assertTrue(x>=0);
    },
    
    "test Should be able to get a correct CountryCount": function()
    {
        var x = this.player1.getCountryCount();
        assertTrue(x === 1);
    }
});

