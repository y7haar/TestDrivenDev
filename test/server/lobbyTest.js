/* 
 *  Testcases for Lobby
 */

TestCase("LobbyTest", {
    
    setUp: function () {
      this.lobby = Object.create(tddjs.server.model.Lobby);
    },

  "test object of Lobby should not be undefined": function () { 
       assertObject(this.lobby);
  }
  
});




