/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    
    setUp: function () {
      this.lobbyController = Object.create(tddjs.server.controller.LobbyController);
      this.lobby1 = {};
    },

  "test object of LobbyController should not be undefined": function () { 
      
      assertObject(this.lobbyController);
  },
  
    "test lobbyController should store lobby1": function () { 
      assertEquals(0, this.lobbyController.getLobbyCount());
      this.lobbyController.addLobby(this.lobby1);
       assertEquals(1, this.lobbyController.getLobbyCount());
  }
  
});


