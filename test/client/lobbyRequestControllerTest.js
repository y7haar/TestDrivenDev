/* 
 *  Test cases for Lobby Requests
 */

TestCase("LobbyRequestControllerTest", {
    setUp: function () {
        this.lobbyRequestController = new tddjs.client.controller.lobbyRequestController();
        
        this.ajax = tddjs.util.ajax;
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeXMLHttpRequest();
        this.sandbox.useFakeServer();
        
    }, 
    tearDown: function ()
    {
        delete this.lobbyRequestController;
        this.sandbox.restore();
    },
    
    "test lobbyRequestController should not be undefined after constructor call": function () {  
        assertObject(this.lobbyRequestController);
    },
    
    "test lobbyRequestController should have a method to request all lobbies": function () {  
        assertFunction(this.lobbyRequestController.requestAllLobbies);
    },
    
     "test requestAllLobbies should perform a GET request to /lobbies": function () {         
         this.lobbyRequestController.requestAllLobbies();
         
         assertEquals(1, this.sandbox.server.requests.length);
         assertEquals("GET", this.sandbox.server.requests[0].method);
         assertEquals("/lobbies", this.sandbox.server.requests[0].url);
    },
    
    "test requestAllLobbies should call onAllLobbiesSuccess on success": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onAllLobbiesSuccess");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestAllLobbies();
        
        this.sandbox.server.requests[0].respond(200, "", "");
        sinon.assert.calledOnce(callback); 
    },
    
    "test requestAllLobbies should call onAllLobbiesFailure on failure": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onAllLobbiesFailure");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestAllLobbies();
        this.sandbox.server.requests[0].respond(400, "", "");
        sinon.assert.calledOnce(callback); 
    },
    
    "test constroller should have function to request a new lobby": function () {         
        assertFunction(this.lobbyRequestController.requestNewLobby);
    },
    
    "test requestNewLobby should perform POST request to /lobbies": function () {         
        this.lobbyRequestController.requestNewLobby();
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals("/lobbies", this.sandbox.server.requests[0].url);
    },
    
     "test requestNewLobby should perform POST request with new serialized lobby as JSON string": function () {         
        this.lobbyRequestController.requestNewLobby();
        
        // TO DO
        // Compare sended data with serialized lobby
    }
});
