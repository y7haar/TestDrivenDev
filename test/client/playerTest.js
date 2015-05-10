 /* 
 * Testcases for Player
 */
TestCase("PlayerTest",
{
    setUp: function () {
        this.player1 = new tddjs.client.player();
        this.country1 = new tddjs.client.map.country();
        this.country1.setName("Aranonda");
        this.country2 = new tddjs.client.map.country();
        this.country2.setName("Lorna");
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
    
    "test Shouldnt be able to ask for Countries which arent countries or country-Names": function()
    {
        var player = this.player1;
        assertException(function(){ player.hasCountryByObject({});}, "TypeError");
        assertException(function(){ player.hasCountryByName({});}, "TypeError");
    },
    
    "test Shouldnt be able to add something thats not a Country": function()
    {
        var player = this.player1;
        var test = 5;
        assertException(function(){player.addCountry(test);},"TypeError");
    },
    
    "test Should be able to add a Country and find it afterwards": function()
    {
        assertFalse(this.player1.hasCountryByName("Aranonda"));
        assertFalse(this.player1.hasCountryByObject(this.country1));
        this.player1.addCountry(this.country1);
        assertTrue(this.player1.hasCountryByObject(this.country1));
        assertTrue(this.player1.hasCountryByName("Aranonda"));
    },
    
    "test Shouldnt be able to remove something thats not a Country": function()
    {
        var player = this.player1;
        var test = 5;
        assertException(function(){player.removeCountry(test);},"TypeError");
        assertException(function(){player.removeCountry(player);},"TypeError");
    },
    
    "test Shouldnt be able to find country that has not been added yet": function(){
        assertFalse(this.player1.hasCountryByObject(this.country2));
        assertFalse(this.player1.hasCountryByName("Lorna"));
    },
    
    "test Should be able to add and remove a Country. A removed Country should not be found": function()
    {
        this.player1.addCountry(this.country2);
        assertTrue(this.player1.hasCountryByObject(this.country2));
        assertTrue(this.player1.hasCountryByName("Lorna"));
        this.player1.removeCountry(this.country2);
        assertFalse(this.player1.hasCountryByObject(this.country2));
        assertFalse(this.player1.hasCountryByName("Lorna"));
    },
    
    "test Shouldnt be able to get a Country thats not added": function()
    {
        var player = this.player1;
        assertNull(player.getCountry("Lorna"));
    },
    
    "test Should be able to get the asked country that has been added": function()
    {
        this.player1.addCountry(this.country1);
        assertSame(this.country1, this.player1.getCountry("Aranonda"));
    },
    
    "test Should be able to get a valid Country-Count": function()
    {
        var x = this.player1.getCountryCount();
        assertTrue(x>=0);
    },
    
    "test Should be able to get a correct CountryCount": function()
    {
        var x = this.player1.getCountryCount();
        assertTrue(x === 0);
        this.player1.addCountry(this.country1);
        x = this.player1.getCountryCount();
        assertTrue(x === 1);
        this.player1.addCountry(this.country2);
        x = this.player1.getCountryCount();
        assertTrue(x === 2);
    },
    
    "test Should be able to set and get only valid Hex-Values for Colors": function()
    {
        assertFunction(this.player1.getColor);
        assertFunction(this.player1.setColor);
        
        this.player1.setColor("#FFFFFF");
        assertEquals("#FFFFFF", this.player1.getColor());
    },
    
    "test Should be able to set and get the player-Id as Number. Id should be only able to get set once": function()
    {
        assertFunction(this.player1.setId);
        assertFunction(this.player1.getId);
        
        this.player1.setId(1);
        assertTrue(this.player1.getId() === 1);
        var player =this.player1;
        assertException(function(){player.setId("Fisch");}, "TypeError");
        assertException(function(){player.setId(2);}, "Error");
    },
    
    "test Should be able to serialize a Player correctly": function()
    {
        assertFunction(this.player1.serialize());
    }
});

