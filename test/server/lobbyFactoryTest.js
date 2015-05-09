/* 
 *  Testcases for LobbyFactory
 */

TestCase("LobbyFactoryTest", {
    
    setUp: function () {
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
    },
    
    tearDown: function () {
    },

  "test object of LobbyFactory should not be undefined": function () { 
       assertObject(this.lobbyFactory);
  }
  
});
