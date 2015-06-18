/* 
 *  Testcases for LobbyFactory
 */

TestCase("LobbyFactoryTest", {
    setUp: function() {
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
    },
    tearDown: function() {
        delete this.lobbyFactory;
    },
    "test object of LobbyFactory should not be undefined": function() {
        assertObject(this.lobbyFactory);
    },
    "test factory should provide getter for new unique instances of Lobby with correct Id": function() {
        var currentId = tddjs.server.controller.lobbyController.getInstance().getNextId();

        this.lobby1 = this.lobbyFactory.getNewLobby();
        this.lobby2 = this.lobbyFactory.getNewLobby();

        assertNotSame(this.lobby1, this.lobby2);
        assertEquals(currentId + 1, this.lobby1.getId());
        assertEquals(currentId + 2, this.lobby2.getId());
    }

});
