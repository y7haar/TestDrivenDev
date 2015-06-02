/* 
 Testcases for the Gameloop
 */


TestCase("GameLoopTests", {
        
    setUp: function () {
        
        this.gameLoop =  new tddjs.client.gameLoopController();      
        this.map = new tddjs.client.map.map();
        this.player1 = new tddjs.client.player();
    },
    tearDown: function()
    {
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
    },
    "test gameloop should not be undefined": function () {      
      assertObject(this.gameLoop);      
    },
    "test gameLoop should be instance of gameLoopControler": function () {        
        assertTrue(this.gameLoop instanceof tddjs.client.gameLoopController);
    },
    "test gameLoop should store 1 player, exception if not instance of Player": function () {        
    
        var fakePlayer = {name:'HansWurst'};
        
        this.gameLoop.setPlayer(this.player1);
        assertSame(this.gameLoop.getPlayer(),this.player1);

        var gameLoop = this.gameLoop;
        
        assertExpection(function(){
            gameLoop.setPlayer(fakePlayer);
        },"TypeError");
        
        assertEquals(this.gameLoop.getPlayer(),this.player1);          
    },
    "test gameloop should store a map, exception if not instance of Map": function () {
        
        var fakeMap = {mapName:'PremiumMap'};
        
        this.gameLoop.setMap(this.map);
        assertSame(this.gameLoop.getMap(), this.map);
        
        var gameLoop = this.gameLoop;
        assertExpection(function(){
            gameLoop.setMap(fakeMap);
        },"TypeError");
        
        assertSame(this.gameLoop.getMap(), this.map);           
    }  

});