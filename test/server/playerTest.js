 /* 
 * Testcases for Player on the server side
 */
TestCase("PlayerServerTest",
{
    setUp: function () {
        this.player1 = new tddjs.server.player();
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
    
    "test token should be able to setted and getted correctly": function() 
    {
        this.player1.setToken("dgdfgdfg");
        
        assertEquals("dgdfgdfg", this.player1.getToken());
    },
    
    "test should throw Error when token is not a string": function() 
    {
        var player = this.player1;

        assertException(function(){player.setToken(4);},"TypeError");
        assertNoException(function(){player.setToken("ad");});
    },
    
    "test should throw Error when token is setted more than once": function() 
    {
        var player = this.player1;

        assertNoException(function(){player.setToken("ad");});
        assertException(function(){player.setToken("ad");}, "Error");
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
    },
    
    "test Should be able to deserialize a Player correctly": function()
    {   
        var json = {
            id: 2,
            name: "Peter",
            color: "#FFFFFF"
        };
        
        json = JSON.stringify(json);
        
        this.player1.deserialize(json);
        
        assertEquals(2, this.player1.getId());
        assertEquals("Peter", this.player1.getName());
        assertEquals("#FFFFFF", this.player1.getColor());
    },
    
    "test Should throw error if Id is incorrect on deserialize": function()
    {   
        var player1 = this.player1;
        var json = {
            id: "asd",
            name: "Peter",
            color: "#FFFFFF"
        };
        json = JSON.stringify(json);
        
        assertException( function() { player1.deserialize(json); }, "TypeError");
        

    },
    
    "test Should throw error if name is incorrect on deserialize": function()
    {   
        var player1 = this.player1;
        
        var json = {
            id: 2,
            name: 4,
            color: "#FFFFFF"
        };
        
        json = JSON.stringify(json);
        
        assertException( function() { player1.deserialize(json); }, "TypeError");
    },
    
    "test Should throw error if color is incorrect on deserialize": function()
    {   
        var player1 = this.player1;
        
        var json = {
            id: 2,
            name: "Peter",
            color: "#hjk"
        };
        
        json = JSON.stringify(json);
        
        assertException( function() { player1.deserialize(json); }, "Error");
    }
});
