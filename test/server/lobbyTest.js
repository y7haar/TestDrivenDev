/* 
 *  Testcases for Lobby
 */

TestCase("LobbyPlayerTest", {
    
    setUp: function () {
        this.lobby = new tddjs.server.model.lobby();
        this.lobby2 = new tddjs.server.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
    },
    
    tearDown: function () {
        this.lobby.getPlayers().length = 0;
        
        delete this.lobby;
        delete this.lobby2;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },

  "test object of Lobby should not be undefined": function () { 
       assertObject(this.lobby);
  },
  
    "test Lobby should store Id": function () { 
       this.lobby.setId(2);
       assertEquals(2, this.lobby.getId());

       this.lobby2.setId(10);
       assertEquals(2, this.lobby.getId());
       assertEquals(10, this.lobby2.getId());
  },
  
  "test setting the lobby id should only be allowed once, otherwise throw an exception": function () { 
       this.lobby.setId(2);
       assertEquals(2, this.lobby.getId());
       
       var lobby = this.lobby;
       
       assertException(function() { lobby.setId(3); }, "Error");
  },
  
    "test Lobby should store name": function () { 
        this.lobby.setName("TestLobby");
        assertEquals("TestLobby", this.lobby.getName());
        
        this.lobby2.setName("TestLobby2");
        assertEquals("TestLobby", this.lobby.getName());
        assertEquals("TestLobby2", this.lobby2.getName());
  },
  
      "test should throw Exception when name is no string": function () { 
        assertException(function() {this.lobby.setName(3);}, "TypeError");
  },
  
    "test should throw Exception when Id is no Number": function () { 
        assertException(function() {this.lobby.setId("a");}, "TypeError");
  },
  
    "test Lobby should store player1 and player2 and player 3": function () { 
        this.lobby.setMaxPlayers(3);
        
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);
        
        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        
        this.lobby.addPlayer(this.player3);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player3) >= 0);
  },
  
      "test Lobby should only store player1, not store player3 and kick player2 when setter is called": function () { 
        this.lobby.setMaxPlayers(2);
          
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);
        
        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        
        this.lobby.addPlayer(this.player3);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);
        
        this.lobby.setMaxPlayers(1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);
        
  },
  
        "test Lobby should store player1 and kick player2 and player3": function () { 
        this.lobby.setMaxPlayers(4);
          
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        
        this.lobby.kickPlayer(this.player1);
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.kickPlayer(this.player2);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
  }
  
});


TestCase("LobbyLeaderTest", {
    
    setUp: function () {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
        this.lobby.setMaxPlayers(4);
    },
    
    tearDown: function () {
        this.lobby.getPlayers().length = 0;
        delete this.lobby;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },

   "test Lobby should store a lobby leader": function () { 
        this.lobby.addPlayer(this.player1);
        this.lobby.setLeader(this.player1);
        
        assertSame(this.player1, this.lobby.getLeader());
  },
  
     "test Lobby should throw an Exception if leader is not stored as player": function () { 
        var player = this.player1;    
        var lobby = this.lobby;
        
        assertException(function() { lobby.setLeader(player); }, "Error");
  },
  
    "test Lobby should set player2 as new leader, after player1 is kicked": function () { 
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.addPlayer(this.player3);
        
        this.lobby.setLeader(this.player1);
        assertSame(this.player1, this.lobby.getLeader());
        
        this.lobby.kickPlayer(this.player1);
        assertNotSame(this.player1, this.lobby.getLeader());
        assertSame(this.player2, this.lobby.getLeader());
  },
  
  "test Lobby should set leader null if all players are kicked": function () { 
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        
        this.lobby.setLeader(this.player1);
        assertSame(this.player1, this.lobby.getLeader());
        
        this.lobby.kickPlayer(this.player1);
        this.lobby.kickPlayer(this.player2);
        assertNull(this.lobby.getLeader());
  }
  
});


TestCase("LobbyServerTest", {
    
    setUp: function () {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
        this.lobby.setMaxPlayers(4);
    },
    
    tearDown: function () {
        this.lobby.getPlayers().length = 0;
        delete this.lobby;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },

   "test Lobby should have a serialize method that returns a json string": function () { 
       this.player1.setName("Bob");
       this.player2.setName("Hanswurst");
       
       this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.setLeader(this.player1);
        this.lobby.setMaxPlayers(2);
        this.lobby.setId(42);
        this.lobby.setName("TestLobby");

        var json = this.lobby.serialize();
        json = JSON.parse(json);
        
        assertEquals(2, json.maxPlayers);
        assertEquals("TestLobby", json.name);
        assertEquals(42, json.id);
        assertEquals("Bob", json.leader);
  }
  
     
  
});