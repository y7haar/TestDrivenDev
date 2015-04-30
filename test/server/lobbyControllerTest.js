/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    
    setUp: function () {
      this.lobbyController = Object.create(tddjs.server.controller.LobbyController);
      this.lobby1 = {};
      this.lobby2 = {};
    },
    
    tearDown: function(){
        this.lobbyController.getLobbies().length = 0;
    },

  "test object of LobbyController should not be undefined": function () { 
      
        assertObject(this.lobbyController);
  },
  
    "test lobbyController should store lobby1 and lobby2": function () { 
        assertEquals(0, this.lobbyController.getLobbyCount());
        this.lobbyController.addLobby(this.lobby1);
         assertEquals(1, this.lobbyController.getLobbyCount());
         this.lobbyController.addLobby(this.lobby2);
         assertEquals(2, this.lobbyController.getLobbyCount());
  },
  
      "test lobbyController should hold a reference to lobby1 and lobby2": function () { 
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[1]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[1]);
      
        this.lobbyController.addLobby(this.lobby1);
        assertSame(this.lobby1, this.lobbyController.getLobbies()[0]);
       
        this.lobbyController.addLobby(this.lobby2);
        assertSame(this.lobby2, this.lobbyController.getLobbies()[1]);
  }
  
});


