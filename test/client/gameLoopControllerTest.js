/* 
 Testcases for the Gameloop
 */


TestCase("GameLoopTests", {
        
    setUp: function () {
        
        this.gameLoop =  new tddjs.client.game.gameLoopController();      
        this.map = new tddjs.client.Map();
        this.player1 = new tddjs.client.Player();
    },
    tearDown: function()
    {
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
    },
    "test object gameloop should not be undefined": function () {
      
      assertObject(this.gameLoop);      
    },
    "test object should be instance of gameLoopControler": function () {
        
        assertTrue(this.gameLoop instanceof tddjs.client.game.gameLoopController);
    },
    "test object should store 1 player, exception if not instance of Player": function () {        
    
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
    },    
    "test return true if a attack is possible false if not": function () { 
        
        this.gameLoop.setMap(this.map);
        this.gameLoop.setPlayer(this.player1);
        
        var c1 = new tddjs.client.map.country();
        var c2 = new tddjs.client.map.country();
        var c3 = new tddjs.client.map.country();
        
        c1.addBorder(c2);
        c2.addBorder(c1);       
        
        assertTrue(this.gameLoop.isAttackPossible(c1,c2));
           
    }
  
  
});