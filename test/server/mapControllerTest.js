/* 
 * Testcases for MapController
 */
TestCase("MapControllerTest",
{
    setUp: function ()
    {
        this.mapCon = new tddjs.server.controller.mapController();
   
        //Spieler
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        this.player3 = new tddjs.server.player();
        this.player4 = new tddjs.server.player();
        
        //Spielergruppen
        this.one = [this.player1];
        this.two = [this.player1, this.player2];
        this.three = [this.player1, this.player2, this.player3];
        this.four = [this.player1, this.player2, this.player3, this.player4];
    }, 
    
    tearDown: function ()
    {
        delete this.mapCon;
    },
    
    "test object of mapController should not be undefined": function()
    {  
        assertObject(this.mapCon);
    },
    
    "test Cant init with a playersize below two": function()
    {
        var mapCon = this.mapCon;
        var one = this.one;
        
        assertException(function(){mapCon.init(one);}, "Error");
    },
    
    "test if mapController has a instance of mapGenerator after init": function()
    {  
        this.mapCon.init(this.two);
        var mapGen = this.mapCon.getMapGenerator();
        
        assertTrue(mapGen instanceof tddjs.server.controller.mapGenerator);
    },
    
    "test mapController should be setup before getMap is called":function()
    {
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getMap();},"Error");
    },
    
    "test mapController should be setup before getSerializedMap is called":function()
    {
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getSerializedMap();},"Error");
    },
    
    "test mapController should be reseted when reset is called":function()
    {
        this.mapCon.init(this.two);
        this.mapCon.reset();
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getMap();},"Error");
    },
    
    "test if mapController return valid serverMap": function()
    {  
        this.mapCon.init(this.two);
        //TODO: strukture überlegen, wie was aufgerufen werden muss
        
        var map = this.mapCon.getMap();
        //TODO: test map
    },
    
    "test if mapController return valid serialized clientMap": function()
    {  
        //TODO: test für serialisierte map
    },
    
    "test mapController should return same map if not reseted": function()
    {  
        //TODO: gleicher test wie "test if mapController return valid serverMap"
        // nur 2mal, um zu testen ob 2mal die selbe map kommt
        
        this.mapCon.init(this.four);
        var map = this.mapCon.getMap();
        var map2 = this.mapCon.getMap();
        
        assertEquals(map,map2);
    },
    
    "test mapController should return same server map if not reseted": function()
    {        
        this.mapCon.init(this.four);
        var map = this.mapCon.getServerMap();
        var map2 = this.mapCon.getServerMap();
        
        assertEquals(map,map2);
    },
    
    "test mapController should return same serialized map if not reseted": function()
    {         
        this.mapCon.init(this.four);
        var map = this.mapCon.getServerMap();
        var map2 = this.mapCon.getServerMap();
        
        assertEquals(map,map2);
    },
    
    "test if mapController produce different mapSizes for different Playercount": function()
    {       
        this.mapCon.init(this.two);
        var map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(110, map.cellGrid.length);
        assertEquals(110, map.cellGrid[0].length);
        
        this.mapCon.init(this.three);
        map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(130, map.cellGrid.length);
        assertEquals(130, map.cellGrid[0].length);
        
        this.mapCon.init(this.four);
        map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(150, map.cellGrid.length);
        assertEquals(150, map.cellGrid[0].length);
    } 
});
