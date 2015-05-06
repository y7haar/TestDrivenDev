/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    
    setUp: function () {
      this.lobbyController = Object.create(tddjs.server.controller.LobbyController);
      this.lobby1 = Object.create(tddjs.server.model.Lobby);
      this.lobby2 = Object.create(tddjs.server.model.Lobby);
      this.lobby5 = Object.create(tddjs.server.model.Lobby);
      
      this.lobby1.setId(0);
      this.lobby2.setId(1);
      this.lobby5.setId(5);
    },
    
    tearDown: function(){
        this.lobbyController.removeLobby(this.lobby1);
        this.lobbyController.removeLobby(this.lobby2);
        this.lobbyController.removeLobby(this.lobby5);
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
  
   "test lobbyController should return a specific Lobby by Id ": function () { 
        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);
        
        assertSame(this.lobby1, this.lobbyController.getLobbyById(0));
        assertSame(this.lobby2, this.lobbyController.getLobbyById(1));
  },
  
   "test lobbyController should throw Exception if lobbyController does not store an element with the given id ": function () {     
       var lobbyController = this.lobbyController; 
       assertException(function(){lobbyController.getLobbyById(5);}, "Error");
  },
  
  "test lobbyController should throw Exception if parameter is no number ": function () { 
        var lobbyController = this.lobbyController;
        assertException(function() {lobbyController.getLobbyById("asd");}, "TypeError");
  },
  
      "test lobbyController should hold a reference to lobby1 and lobby2 and store elements at given index (id)": function () { 
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[5]);
        assertNotSame(this.lobby5, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby5, this.lobbyController.getLobbies()[5]);
      
        this.lobbyController.addLobby(this.lobby1);
        assertSame(this.lobby1, this.lobbyController.getLobbies()[0]);
       
        this.lobbyController.addLobby(this.lobby5);
        assertSame(this.lobby5, this.lobbyController.getLobbies()[5]);
  },
  
   "test lobbyController should throw an Exception when adding a Lobby at an existent index": function () { 
        var lobbyController = this.lobbyController;
        var lobby1 = this.lobby1;
        
        lobbyController.addLobby(lobby1);
        assertException(function() { lobbyController.addLobby(lobby1); }, "Error");
  },
  
        "test lobbyController should hold a reference to lobby1 and remove lobby2": function () { 
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[1]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[1]);
      
        this.lobbyController.addLobby(this.lobby1);
        assertSame(this.lobby1, this.lobbyController.getLobbies()[0]);
       
        this.lobbyController.addLobby(this.lobby2);
        assertSame(this.lobby2, this.lobbyController.getLobbies()[1]);
        
        assertEquals(2, this.lobbyController.getLobbyCount());
        
        this.lobbyController.removeLobby(this.lobby2);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[1]);
        assertEquals(1, this.lobbyController.getLobbyCount());
  }
  
});


