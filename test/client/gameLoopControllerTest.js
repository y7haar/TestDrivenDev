/* 
 Testcases for the Gameloop
 */


TestCase("GameLoopTests", {
        
    setUp: function () {
        
        this.gameLoop =  new tddjs.client.game.gameLoopController();      
    
    },

  "test object gameloop shoulde not be undefined": function () {
      
      assertObject(this.gameLoop);      
  }
  
});