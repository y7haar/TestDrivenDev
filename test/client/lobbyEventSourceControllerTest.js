/* 
 *  Testcases for LobbyEventSourceController
 *  
 *  This class handles data exchange with the Server via Event Source
 *  
 */

TestCase("LobbyEventSourceControllerTest", {
    setUp: function() {
        this.lobby = new tddjs.client.model.lobby();
        this.lobby.setId(1);
        this.lobby.setName("L1");
        this.lobby.setMaxPlayers(4);
        
        this.url = BASE_URL + "lobbies/" + this.lobby.getId();
        
        this.lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);

    },
    tearDown: function(){
        this.sandbox.restore();
    },
    
    "test LobbyEventSourceController should not be undefined after constructor call": function() {
        assertObject(this.lobbyEventSourceController);
    },
    
    "test LobbyEventSourceController should have function to establish an EventSource connection": function() {
        assertFunction(this.lobbyEventSourceController.establishConnection);
    },
    
    "test LobbyEventSourceController should have function to set a lobby": function() {
        assertFunction(this.lobbyEventSourceController.setLobby);
    },
    
     "test LobbyEventSourceController should have function to get a lobby": function() {
        assertFunction(this.lobbyEventSourceController.getLobby);
    },
    
    "test setter and getter for lobby should set and get lobby": function() {
        assertUndefined(this.lobbyEventSourceController.getLobby());
        this.lobbyEventSourceController.setLobby(this.lobby);
        assertSame(this.lobby, this.lobbyEventSourceController.getLobby());
    },
    
    "test setter for lobby should throw Error if parameter is no lobby": function() {
        var controller = this.lobbyEventSourceController;
        var lobby = this.lobby;
        
        assertNoException(function() { controller.setLobby(lobby); });
        assertException(function() { controller.setLobby("5"); }, "TypeError");
    },
    
    "test LobbyEventSourceController should have function to set a lobbyUi": function() {
        assertFunction(this.lobbyEventSourceController.setLobbyUi);
    },
    
     "test setter for lobbyUi should throw Error if parameter is no lobbyUi": function() {
        var controller = this.lobbyEventSourceController;
        var lobbyUi = new tddjs.client.ui.lobbyUi();
        
        assertNoException(function() { controller.setLobbyUi(lobbyUi); });
        assertException(function() { controller.setLobbyUi("6"); }, "TypeError");
    },
    
    "test establishConnection should do an EventSource request": function() {
        assertEquals(0, this.sandbox.server[this.url].clients.length);
        this.lobbyEventSourceController.establishConnection();
        assertEquals(1, this.sandbox.server[this.url].clients.length);
    }
    });