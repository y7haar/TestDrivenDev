/* 
 *  Testcases for LobbyEventSourceController
 *  
 *  This class handles data exchange with the Server via Event Source
 *  
 */

TestCase("LobbyEventSourceControllerTest", {
    setUp: function() {
        this.url = BASE_URL + "";
        
        this.lobby = new tddjs.client.model.lobby();
        this.lobby.setId(1);
        this.lobby.setName("L1");
        this.lobby.setMaxPlayers(4);
        
        this.lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);

    },
    tearDown: function(){
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
    
    "test lobby getter / setter should work properly": function() {
        assertUndefined(this.lobbyEventSourceController.getLobby());
        this.lobbyEventSourceController.setLobby(this.lobby);
        assertSame(this.lobby, this.lobbyEventSourceController.getLobby());
    },
    
    "test LobbyEventSourceController should have function to set lobbyUi": function() {
        assertFunction(this.lobbyEventSourceController.setLobbyUi);
    },
    
    "test establishConnection should establish a new EventSource connection": function() {
        assertEquals(0,this.sandbox.server[this.url].clients.length);        
        this.lobbyEventSourceController.establishConnection();
        
        assertEquals(1,this.sandbox.server[this.url].clients.length);
    }
    
    });