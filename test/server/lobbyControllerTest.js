/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    
    setUp: function () {
      this.lobbyController = new tddjs.server.controller.lobbyController();
      this.lobby1 = new tddjs.server.model.lobby();
      this.lobby2 = new tddjs.server.model.lobby();
      this.lobby5 = new tddjs.server.model.lobby();
      
      this.lobby1.setId(0);
      this.lobby2.setId(1);
      this.lobby5.setId(5);
      
      console.log(this.lobby1.getId());
      console.log(this.lobby2.getId());
      console.log(this.lobby5.getId());
    },
    
    tearDown: function(){
        this.lobbyController.removeLobby(this.lobby1);
        this.lobbyController.removeLobby(this.lobby2);
        this.lobbyController.removeLobby(this.lobby5);
        
        delete this.lobby1;
        delete this.lobby2;
        delete this.lobby5;
        delete this.lobbyController;
    },

  "test object of LobbyController should not be undefined": function () { 
        assertObject(this.lobbyController);
  },
  
    "test lobbyController should store lobby1 and lobby2, Exception if parameter is not a Lobby": function () { 
        assertEquals(0, this.lobbyController.getLobbyCount());
        this.lobbyController.addLobby(this.lobby1);
         assertEquals(1, this.lobbyController.getLobbyCount());
         this.lobbyController.addLobby(this.lobby2);
         assertEquals(2, this.lobbyController.getLobbyCount());
         
         var lobbyController = this.lobbyController;
         
         console.log("#####################");
         assertException(function() {lobbyController.addLobby("asd");}, "TypeError");
  },
  
   "test lobbyController should return a specific Lobby by Id": function () { 
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
  
        "test lobbyController should hold a reference to lobby1 and remove lobby2, Exception at removing if parameter is no Lobby": function () { 
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
        
        var lobbyController = this.lobbyController;
        assertException(function() {lobbyController.removeLobby("asd");}, "TypeError");
  },
  
  "test lobbyController should manage and provide the next available Id": function () { 
      assertEquals(0, this.lobbyController.getNextId());
      assertEquals(0, this.lobbyController.getNextId());
      
      this.lobbyController.addLobby(this.lobby1);
      this.lobbyController.addLobby(this.lobby2);
      
      assertEquals(2, this.lobbyController.getNextId());
      
      this.lobbyController.removeLobby(this.lobby2);
      
      console.log(this.lobbyController.getLobbies());
      
      assertEquals(0, this.lobbyController.getNextId());
      
      assertEquals(3, this.lobbyController.getNextId());
      
      console.log(this.lobbyController.getLobbies());
  },
  
  "test lobbyController should provide a getInstance-method and always return the same Object": function () { 
      this.lobbyController1 = tddjs.server.controller.lobbyController.getInstance();
      this.lobbyController2 = tddjs.server.controller.lobbyController.getInstance();
      
      assertSame(this.lobbyController1, this.lobbyController2);
      this.lobbyController1.addLobby(this.lobby1);
      assertEquals(this.lobbyController1.getLobbyCount(), this.lobbyController2.getLobbyCount());
  }
  
});


