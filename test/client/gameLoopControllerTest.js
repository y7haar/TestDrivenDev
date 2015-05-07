/* 
 Testcases for the Gameloop
 */


TestCase("GameLoopTests", {
        
    setUp: function () {
        
        this.gameLoop =  new tddjs.client.game.gameLoopController();      
    
    },

    "test object gameloop should not be undefined": function () {
      
      assertObject(this.gameLoop);      
    },
    "test object should be instance of gameLoopControler": function () {
        
        assertTrue(this.gameLoop instanceof tddjs.client.game.gameLoopController);
    },
    "test object should store 1 player, exception if not instance of Player": function () {
        
        var player1 = new tddjs.client.Player();
        var fakePlayer = {name:'HansWurst'};
        
        this.gameLoop.setPlayer(player1);
        assertSame(this.gameLoop.getPlayer(),player1);

        var gameLoop = this.gameLoop;
        
        assertExpection(function(){
            gameLoop.setPlayer(fakePlayer);
        },"TypeError");
        
        assertEquals(this.gameLoop.getPlayer(),player1);          
    },
    "test gameloop should store a map, exception if not instance of Map": function () {
        
        var map = new tddjs.client.Map();
        var fakeMap = {mapName:'PremiumMap'};
        
        this.gameLoop.setMap(map);
        assertSame(this.gameLoop.getMap(), map);
        
        var gameLoop = this.gameLoop;
        assertExpection(function(){
            gameLoop.setMap(fakeMap);
        },"TypeError");
        
        assertSame(this.gameLoop.getMap(), map);           
    }
   
    
    
  
});