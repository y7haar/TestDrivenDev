/* 
 *  Testcases for Lobby
 */

TestCase("LobbyTest", {
    
    setUp: function () {
      this.lobby = Object.create(tddjs.server.model.Lobby);
      this.player1 = {};
      this.player2 = {};
    },

  "test object of Lobby should not be undefined": function () { 
       assertObject(this.lobby);
  },
  
    "test Lobby should store player1 and player2": function () { 
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        
        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        
        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
  }
  
});




