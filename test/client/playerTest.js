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
    
    "test Player Object should be created": function ()
    {
        assertObject(this.player1);
    },
    
    "test Player should have the needed Function": function()
    {
        assertFunction(this.player1.getColor);
        assertFunction(this.player1.setColor);
        assertFunction(this.player1.setId);
        assertFunction(this.player1.getId);
        assertFunction(this.player1.getName);
        assertFunction(this.player1.setName);
        assertFunction(this.player1.addCountry);
        assertFunction(this.player1.removeCountry);
        assertFunction(this.player1.serialize);
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
        
        assertException(function(){ player.hasCountryByObject({});}, "TypeError");
    },
    
    "test Shouldnt be able to ask for Countries which arent country-Names": function()
    {
        var player = this.player1;
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
    
    "test Shouldnt be able to find country that has not been added yet": function()
    {
        assertFalse(this.player1.hasCountryByObject(this.country2));
        assertFalse(this.player1.hasCountryByName("Lorna"));
    },
    
    "test Should be able to add a Country": function()
    {
        this.player1.addCountry(this.country2);
        
        assertTrue(this.player1.hasCountryByObject(this.country2));
        assertTrue(this.player1.hasCountryByName("Lorna"));
    },
    
    "test Should be able to remove a Country. A removed Country should not be found": function()
    {
        this.player1.addCountry(this.country2);
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
        this.player1.addCountry(this.country1);
        var y = this.player1.getCountryCount();
        this.player1.addCountry(this.country2);
        var z = this.player1.getCountryCount();
        
        assertTrue(x === 0);     
        assertTrue(y === 1);      
        assertTrue(z === 2);
    },
    
    "test Should be able to set and get Hex-Values for Colors": function()
    {      
        this.player1.setColor("#FFFFFF");
        
        assertEquals("#FFFFFF", this.player1.getColor());
    },
    
    "test Shouldnt be able to set invalid Values for Hex-Colors": function()
    {
        var player = this.player1;
        
        assertException(function(){player.setColor(125);}, "TypeError");
        assertException(function(){player.setColor("#FFFFF");}, "Error");
        assertException(function(){player.setColor("#FFFFFFF");}, "Error");
        assertException(function(){player.setColor("FFFFFF");}, "Error");
        assertException(function(){player.setColor("*000000");}, "Error");
        assertException(function(){player.setColor("#-90000");}, "Error");
        assertException(function(){player.setColor("#FF!FFF");}, "Error");
    },
    
    "test Should be able to set and get the player-Id as Number. Id should be only able to get set once": function()
    {     
        this.player1.setId(1);
        var player =this.player1;
        
        assertTrue(this.player1.getId() === 1);
        assertException(function(){player.setId("Fisch");}, "TypeError");
        assertException(function(){player.setId(2);}, "Error");
    },
    
    "test Should be able to serialize a Player correctly": function()
    {    
        this.player1.setId(2);
        this.player1.setName("Ranol");
        this.player1.setColor("#FFFFFF");
        
        var json = this.player1.serialize();
        json = JSON.parse(json);
        
        assertObject(json);
        assertEquals(2, json.id);
        assertEquals("Ranol", json.name);
        assertEquals("#FFFFFF", json.color);
        assertEquals("human", json.type);
    },
    
    "test Should be able to serialize a Player correctly as object": function()
    {    
        this.player1.setId(2);
        this.player1.setName("Ranol");
        this.player1.setColor("#FFFFFF");
        
        var json = this.player1.serializeAsObject();
        
        assertObject(json);
        assertEquals(2, json.id);
        assertEquals("Ranol", json.name);
        assertEquals("#FFFFFF", json.color);
        assertEquals("human", json.type);
    },
    
    "test player should have setter for type": function()
    {    
        assertFunction(this.player1.setType);
    },
    
     "test player should have getter for type": function()
    {    
        assertFunction(this.player1.getType);
    },
    
    "test setter for type should only accept a string human or bot, else throw Exception": function()
    {    
        var player1 = this.player1;
        
        assertNoException(function() { player1.setType("human"); });
        assertNoException(function() { player1.setType("Human"); });
        
        assertNoException(function() { player1.setType("bot"); });
        assertNoException(function() { player1.setType("Bot"); });
        
        assertException(function() { player1.setType("boot"); }, "TypeError");
        assertException(function() { player1.setType("UltraNatzer1337"); }, "TypeError");
        
    },
    
    "test type should be setted to human by default": function()
    {    
        assertEquals("human", this.player1.getType());
    },
    
    "test player should store a type attribute to differntiate between human player and bot": function()
    {    
        assertEquals("human", this.player1.getType());
        
        this.player1.setType("Bot");
        assertEquals("bot", this.player1.getType());
        
        this.player1.setType("human");
        assertEquals("human", this.player1.getType());
    }
});

