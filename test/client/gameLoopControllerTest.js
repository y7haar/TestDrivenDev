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
    "test object should store players, exception if not instance of Player": function () {
        
        var player1 = new tddjs.client.Player();
        var player2 = new tddjs.client.Player();
        var fakePlayer = {name:'HansWurst'};
        
        this.gameLoop.addPlayer(player1);
        assertEquals(this.gameLoop.getPlayers(),[player1]);
        this.gameLoop.addPlayer(player2);
        assertEquals(this.gameLoop.getPlayers(),[player1,player2]);
        
        
        var gameLoop = this.gameLoop;
        
        assertExpection(function(){
            gameLoop.addPlayer(fakePlayer);
        },"TypeError");
        
        assertEquals(this.gameLoop.getPlayers(),[player1,player2]);          
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