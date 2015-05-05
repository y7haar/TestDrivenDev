/* 
 *  Testcases for Lobby
 */

TestCase("LobbyTest", {
    
    setUp: function () {
        this.lobby = Object.create(tddjs.server.model.Lobby);
        this.player1 = {};
        this.player2 = {};
        this.player3 = {};
    },
    
    tearDown: function () {
        this.lobby.getPlayers().length = 0;
    },

  "test object of Lobby should not be undefined": function () { 
       assertObject(this.lobby);
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




