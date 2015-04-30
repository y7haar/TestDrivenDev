/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    
    setUp: function () {
      this.lobbyController = Object.create(tddjs.server.controller.LobyController);
    },

  "test object of LobbyController should not be undefined": function () { 
      
      assertObject(this.lobbyController);
  }
  
});


